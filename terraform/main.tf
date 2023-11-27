/*terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>4.0"
    }
  }
  
  backend "s3" {
    key = "aws/ec2-deploy/terraform.tfstate"
  }
}*/

provider "aws" {
  region = "us-east-1"
}
resource "aws_instance" "servernode" {
  ami                    = "ami-09d3b3274b6c5d4aa"
  instance_type          = "t2.micro"
  #key_name               = aws_key_pair.key_access.key_name
  key_name               = "vpcpublickey"

  
   connection {
    type        = "ssh"
    host        = self.public_ip
    user        = "ec2-user"
    #private_key = tls_private_key.mykey1.private_key_pem
    private_key = "vpcpublickey"
    timeout     = "4m"
  }
  tags = {
    "name" = "Connect VM"
  }
}

resource "aws_security_group" "alb_security_group"{
  name="alb security group"
  ingress {
    from_port=22
    to_port=22
    protocol="tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description="ssh access"

}
  egress {
    from_port=0
    to_port=0
    protocol="-1"
    cidr_blocks=["0.0.0.0/0"]
  }

  tags={
    name="alb_security_group"
  }
}

########################## Define Key ###########################
resource "tls_private_key" "mykey1" {
  algorithm = "RSA"
}

resource "aws_key_pair" "key_access" {
  key_name   = "mykey"
  public_key = tls_private_key.mykey1.public_key_openssh
  depends_on = [
    tls_private_key.mykey1
  ]

  tags = {
    Name = "access key"
  }
}
output "instance_public_ip" {
  value     = aws_instance.servernode.public_ip
}
