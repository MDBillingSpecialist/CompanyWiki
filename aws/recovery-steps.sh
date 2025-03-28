#!/bin/bash

# This script outlines the steps to enable EC2 Instance Connect on your instance

# 1. SSH to the recovery instance
echo "Connect to the recovery instance with the following command:"
echo "ssh -i recovery-key.pem ubuntu@54.205.51.79"

# 2. Once connected to the recovery instance, run these commands:
echo "
# Once connected, run these commands:

# Mount the attached volume
sudo mkdir -p /mnt/original
sudo mount /dev/xvdf1 /mnt/original

# Check the mount
df -h | grep /mnt/original

# Modify the authorized_keys file to enable EC2 Instance Connect
sudo mkdir -p /mnt/original/home/ubuntu/.ssh
sudo chmod 700 /mnt/original/home/ubuntu/.ssh

# Install ec2-instance-connect package on the original volume's root filesystem
sudo chroot /mnt/original apt-get update
sudo chroot /mnt/original apt-get install -y ec2-instance-connect

# Now unmount the volume
sudo umount /mnt/original

# Exit back to your local machine
exit
"

# 3. After exiting SSH, run these commands:
echo "After exiting SSH, run these commands:"
echo "
# Detach the volume from the recovery instance
aws ec2 detach-volume --volume-id vol-09f42189fb1866af2

# Wait for the volume to be available
aws ec2 wait volume-available --volume-ids vol-09f42189fb1866af2

# Attach the volume back to the original instance
aws ec2 attach-volume --volume-id vol-09f42189fb1866af2 --instance-id i-0150ba41d072edd78 --device /dev/sda1

# Wait for the volume to attach
aws ec2 wait volume-in-use --volume-ids vol-09f42189fb1866af2

# Start the original instance
aws ec2 start-instances --instance-ids i-0150ba41d072edd78

# Wait for the instance to be running
aws ec2 wait instance-running --instance-ids i-0150ba41d072edd78

# Now the instance should be accessible via EC2 Instance Connect
echo 'The instance should now be accessible via EC2 Instance Connect'

# Terminate the recovery instance
aws ec2 terminate-instances --instance-ids i-0048f101b55bd6821
"