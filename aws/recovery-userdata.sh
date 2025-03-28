#!/bin/bash

# Log all output
exec > >(tee /var/log/recovery-script.log) 2>&1

echo "Starting recovery process at $(date)"

# Wait a bit for the volume to be fully attached
sleep 30

# List all block devices
echo "Listing block devices:"
lsblk

# Mount the attached volume
echo "Mounting the original volume..."
mkdir -p /mnt/original

# Determine if we need to mount a partition or the whole device
if [ -e /dev/xvdf1 ]; then
  # There's a partition, mount it
  mount /dev/xvdf1 /mnt/original
else
  # No partition, try mounting the whole device
  mount /dev/xvdf /mnt/original
fi

# Check the mount
echo "Checking mount:"
df -h | grep /mnt/original

# If the mount failed, try another approach
if [ $? -ne 0 ]; then
  echo "First mount attempt failed, trying alternative methods..."
  
  # Try to find the right device
  for dev in xvdf nvme1n1; do
    for part in "" 1 2; do
      if [ -e "/dev/${dev}${part}" ]; then
        echo "Trying to mount /dev/${dev}${part}..."
        mount /dev/${dev}${part} /mnt/original
        if [ $? -eq 0 ]; then
          echo "Successfully mounted /dev/${dev}${part}"
          break 2
        fi
      fi
    done
  done
fi

# Check if mount was successful
if ! grep -q "/mnt/original" /proc/mounts; then
  echo "Failed to mount the volume. Listing all devices for debugging:"
  ls -la /dev/xvd*
  ls -la /dev/nvme*
  exit 1
fi

echo "Volume mounted successfully at $(date)"

# Create SSH directory if it doesn't exist
echo "Setting up SSH directory..."
mkdir -p /mnt/original/home/ubuntu/.ssh
chmod 700 /mnt/original/home/ubuntu/.ssh

# Install ec2-instance-connect on the mounted filesystem
echo "Installing EC2 Instance Connect in the mounted volume..."
chroot /mnt/original apt-get update
chroot /mnt/original apt-get install -y ec2-instance-connect

# Grant SSH access to ec2-instance-connect
echo "Setting up ec2-instance-connect SSH permissions..."
chroot /mnt/original /bin/bash -c "grep -q ec2-instance-connect /etc/group || groupadd ec2-instance-connect"
chroot /mnt/original /bin/bash -c "usermod -a -G ec2-instance-connect ubuntu"

# Enable password-less sudo for ubuntu user (to connect via AWS console)
echo "Enabling password-less sudo for ubuntu user..."
if [ -d /mnt/original/etc/sudoers.d ]; then
  echo "ubuntu ALL=(ALL) NOPASSWD:ALL" > /mnt/original/etc/sudoers.d/ubuntu
  chmod 440 /mnt/original/etc/sudoers.d/ubuntu
fi

# This is a backup approach - modify SSH config to allow password authentication
echo "Configuring SSH to allow password authentication..."
if [ -f /mnt/original/etc/ssh/sshd_config ]; then
  sed -i 's/^PasswordAuthentication no/PasswordAuthentication yes/' /mnt/original/etc/ssh/sshd_config
  sed -i 's/^#PasswordAuthentication yes/PasswordAuthentication yes/' /mnt/original/etc/ssh/sshd_config
fi

# Unmount the volume
echo "Unmounting the volume..."
umount /mnt/original

# Signal completion
echo "Recovery process completed at $(date)"

# Self-terminate this instance after a delay (to allow logs to be viewed)
shutdown -h +2 "Recovery completed, shutting down temporary instance"