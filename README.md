# Meteor UP

#### Production Quality Meteor Deployments

Meteor Up (mup for short) is a command line tool that allows you to deploy any meteor app into your own server. It supports Ubuntu 12.04 or higher servers from any Cloud Infrastructure Provider.

**Table of Contents**

- [Features](#features)
- [Server Configuration](#server-configuration)
- [Installation](#installation)
- [Creating a Meteor Up Project](#creating-a-meteor-up-project)
- [Example File](#example-file)
- [Setting Up a Server](#setting-up-a-server)
    - [Server Setup Details](#server-setup-details)
- [Deploying an App](#deploying-an-app)
    - [Deploy Wait Time](#deploy-wait-time)
    - [Multiple Deployment Targets](#multiple-deployment-targets)
- [Access Logs](#access-logs)
- [Reconfiguring & Restarting](#reconfiguring--restarting)
- [Updating](#updating)
- [Troubleshooting](#troubleshooting)

### Features

* Single command server setup
* Single command deployment
* Environmental Variables management
* Support for [`settings.json`](http://docs.meteor.com/#meteor_settings)
* Password or Private Key(pem) based server authentication
* Access, logs from the terminal (supports log tailing)

### Server Configuration

* Auto-Restart if the app crashed (using forever)
* Auto-Start after the server reboot (using upstart)
* Stepdown User Privileges
* Revert to the previous version, if the deployment failed
* Support for **Hot Code Reload**
* Secured MongoDB Installation
* Pre-Installed PhantomJS

### Installation

    npm install -g mup

If you are looking for password based authentication, you need to [install sshpass](https://gist.github.com/arunoda/7790979) on your local development machine.

### Creating a Meteor Up Project

    mkdir ~/my-meteor-deployment
    cd ~/my-meteor-deployment
    mup init

This will create two files in your Meteor Up project directory, which are:

  * mup.json - Meteor Up configuration file
  * settings.json - Settings for Meteor's [settings API](http://docs.meteor.com/#meteor_settings)

`mup.json` is commented and easy to follow (it supports JavaScript comments)

### Example File

```js
{
  //server authentication info
  "servers": [
    {
      "host": "123.456.789.012",
      "username": "root",
      "password": "x7fj29dhs0"
      //or pem file (ssh based authentication)
      //"pem": "~/.ssh/id_rsa"
    }
  ],

  //install MongoDB in the server
  "setupMongo": false,

  //location of app (local directory)
  "app": "/Users/arunoda/Meteor/my-app",

  //configure environmental
  "env": {
    "PORT": 80,
    "ROOT_URL": "http://myapp.com",
    "MONGO_URL": "mongodb://arunoda:fd8dsjsfh7@hanso.mongohq.com:10023/MyApp",
    "MAIL_URL": "smtp://postmaster%40myapp.mailgun.org:adj87sjhd7s@smtp.mailgun.org:587/"
  },

  //meteor-up checks if the app comes online just after the deployment
  //before mup checks that, it will wait for no. of seconds configured below
  "deployCheckWaitTime": 15
}
```

### Setting Up a Server

    mup setup

This will setup the server for the mup deployments. It will take around 2-5 minutes depending on the server's performance and network availability.

#### Server Setup Details

This is how Meteor Up will configure the server for you. This information will help you to customize server for your needs.

* your app is lives in `/opt/meteor/app`
* mup uses upstart with a config file at `/etc/init/meteor.conf`
* you can start and stop the app with upstart: `start meteor` and `stop meteor`
* logs are located at: `/var/log/upstart/app.log`
* MongoDB installed and bind to the local interface (cannot access from the outside)
* `mongo` is the name of the database

For more information see [`lib/taskLists.js`](https://github.com/arunoda/meteor-up/blob/master/lib/taskLists.js).

### Deploying an App

    mup deploy

This will bundle the meteor project and deploy it to the server.

#### Deploy Wait Time

Meteor-Up checks for if the deployment is successful or not just after the deployment. By default, it will wait 10 seconds before the check. You can configure the wait time with `deployCheckWaitTime` option in the `mup.json`

#### Multiple Deployment Targets

You can use an array to deploy to multiple servers at once. 

To deploy to *different* environments (e.g. staging, production, etc.), use separate Meteor Up configurations in separate directories, with each directory containing separate `mup.json` and `settings.json` files, and the `mup.json` files' `app` field pointing back to your app's local directory. 

### Access Logs

    mup logs -f

Mup can tail logs from the server and it supports all the options of `tail`

### Reconfiguring & Restarting

After you've edit environmental variables or settings.json, you can reconfigure the app without deploying again. Use following command for that.

    mup reconfig

This will also restart the app, so you can use it for that purpose even if you didn't change the configuration file. 

### Updating

To udate `mup` to the latest version, just type:

    npm update mup -g

You should try and keep `mup` up to date in order to keep up with the latest Meteor changes. But note that if you need to update your Node version, you'll have to run `mup setup` again before deploying. 

### Troubleshooting

If you suddenly can't deploy your app anymore, first use the `mup logs -f` command to check the logs for error messages. 

One of the most common problems is your Node version getting out of date. In that case, see “Updating” section above.