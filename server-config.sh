# Assuming you're running on Fedora server

sudo yum update -y
curl -sL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs
sudo npm install -g pm2

# Also, ensure that /home/ec2-user/app directory exists and is writable by your SSH user:
mkdir -p /home/ec2-user/app
chown ec2-user:ec2-user /home/ec2-user/app

# Ensure your .env file is present on the EC2 instance. You can upload it using SCP:
scp -i /path/to/your/private-key ~/.env ec2-user@ <EC2_HOST >:/home/ec2-user/app/.env
