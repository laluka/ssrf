#!/bin/bash
# 0 7 * * * bash -x /opt/ssrf/update-content.sh 2>&1 | tee -a /tmp/ssrf.log
export GIT_SSH_COMMAND='ssh -i /home/lalu/.ssh/ssrf-daily-update-key'
cd /opt/ssrf && git pull && npm run ytdlp && npm run populate && git add . && git commit -am "MAJ: $(date)" && git push

