#!/bin/bash

PUBLIC_IP="44.201.118.87"
WEBSITE_URL="http://$PUBLIC_IP"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Checking deployment status for Company Wiki${NC}"
echo -e "Instance ID: i-0150ba41d072edd78"
echo -e "Public IP: $PUBLIC_IP"
echo -e "URL: $WEBSITE_URL"
echo "----------------------------------------"

# Check instance status
echo -e "${YELLOW}Checking EC2 instance status...${NC}"
INSTANCE_STATUS=$(aws ec2 describe-instance-status --instance-ids i-0150ba41d072edd78 --query 'InstanceStatuses[0].InstanceStatus.Status' --output text)
SYSTEM_STATUS=$(aws ec2 describe-instance-status --instance-ids i-0150ba41d072edd78 --query 'InstanceStatuses[0].SystemStatus.Status' --output text)

if [[ "$INSTANCE_STATUS" == "ok" && "$SYSTEM_STATUS" == "ok" ]]; then
  echo -e "${GREEN}✓ EC2 instance is healthy${NC}"
else
  echo -e "${YELLOW}⚠ EC2 instance is still initializing (Instance: $INSTANCE_STATUS, System: $SYSTEM_STATUS)${NC}"
fi

# Check if the web server is responding
echo -e "\n${YELLOW}Checking web server response...${NC}"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" $WEBSITE_URL || echo "failed")

if [[ "$HTTP_STATUS" == "200" ]]; then
  echo -e "${GREEN}✓ Web server is responding with HTTP 200${NC}"
  echo -e "${GREEN}✓ Your Company Wiki is deployed and accessible at: $WEBSITE_URL${NC}"
elif [[ "$HTTP_STATUS" == "failed" ]]; then
  echo -e "${RED}✗ Connection to web server failed${NC}"
  echo -e "${YELLOW}  The server might still be starting up or installing dependencies.${NC}"
  echo -e "${YELLOW}  Try again in a few minutes.${NC}"
else
  echo -e "${YELLOW}⚠ Web server returned HTTP status: $HTTP_STATUS${NC}"
  echo -e "${YELLOW}  The application might still be starting up.${NC}"
  echo -e "${YELLOW}  Try again in a few minutes.${NC}"
fi

echo -e "\n${YELLOW}Note:${NC} The complete bootstrap process can take 5-10 minutes."
echo -e "If the website is not accessible after 10 minutes, you can check the logs:"
echo -e "  - SSH to the server: ssh -i company-wiki-key.pem ubuntu@$PUBLIC_IP"
echo -e "  - Check user data script log: cat /var/log/cloud-init-output.log"
echo -e "  - Check application logs: journalctl -u company-wiki.service"
echo -e "  - Check Nginx logs: cat /var/log/nginx/error.log"