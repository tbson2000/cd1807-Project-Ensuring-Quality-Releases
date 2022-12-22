#/bin/bash

mkdir azagent;
cd azagent;
curl -fkSL -o vstsagent.tar.gz https://vstsagentpackage.azureedge.net/agent/2.211.1/vsts-agent-linux-x64-2.211.1.tar.gz;
tar -zxvf vstsagent.tar.gz;
if [ -x "$(command -v systemctl)" ];
then
    ./config.sh --environment --environmentname "udacity" --acceptteeeula --agent $HOSTNAME --url https://dev.azure.com/sontb40251/ --work _work --projectname 'hellbaby93' --auth PAT --token $AZURE_DEVOPS_PAT --runasservice;
    sudo ./svc.sh install;
    sudo ./svc.sh start;
else
    ./config.sh --environment --environmentname "udacity" --acceptteeeula --agent $HOSTNAME --url https://dev.azure.com/sontb40251/ --work _work --projectname 'hellbaby93' --auth PAT --token AZURE_DEVOPS_PAT;
    ./run.sh;
fi