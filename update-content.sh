#!/bin/bash
# 0 7 * * * bash -x /opt/cuistops/update-content.sh 2>&1 | tee -a /tmp/cuistops.log
export GIT_SSH_COMMAND='ssh -i /home/lalu/.ssh/cuistops-daily-update-key'
cd /opt/cuistops && git pull && npm run populate && git add . && git commit -am "MAJ: $(date)" && git push

