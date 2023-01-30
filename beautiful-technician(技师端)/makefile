# 放弃本地修改
drop:
	git add .; git stash; git stash drop
# Test环境 test-01 test-02 ...
test%:
	@echo "当前对应环境名称: test$*";
	- git branch -D test$*;
	git fetch;
	export branch="`git branch | grep \* | grep -Eo ' .+'`" && \
		echo "当前分支: $$branch" && \
		git checkout test$* && \
		git pull --rebase && \
		git merge origin/main && \
		echo "merge: \033[0;31morigin/main\033[0m" && \
		git merge $$branch && \
		echo "merge: \033[0;31m$$branch\033[0m" && \
		git push && \
		git checkout $$branch;
# Test环境 test-01 test-02 ...
test:
	@echo "当前对应环境名称: test";
	- git branch -D test;
	git fetch;
	export branch="`git branch | grep \* | grep -Eo ' .+'`" && \
		echo "当前分支: $$branch" && \
		git checkout test && \
		git pull --rebase && \
		git merge origin/main && \
		echo "merge: \033[0;31morigin/main\033[0m" && \
		git merge $$branch && \
		echo "merge: \033[0;31m$$branch\033[0m" && \
		git push && \
		git checkout $$branch;
# 预发环境
pre:
	- git branch -D pre;
	git fetch;
	export branch="`git branch | grep \* | grep -Eo ' .+'`" && \
		echo "当前分支: $$branch" && \
		git checkout pre && \
		git pull --rebase && \
		git merge origin/main && \
		echo "merge: \033[0;31morigin/main\033[0m" && \
		git merge $$branch && \
		echo "merge: \033[0;31m$$branch\033[0m" && \
		git push && \
		git checkout $$branch;

# 快速rebase同步最新main代码，遇到git push推送远端分支时报错(failed to push some refs to)，请执行 git pull --rebase origin $$branch
rebase:
	export branch="`git branch | grep \* | grep -Eo ' .+'`" && \
		git checkout main && \
		git pull --rebase && \
		git checkout $$branch && \
		git rebase main;
#生成合并提交时处理
mr:
	@export branch="`git branch | grep \* | grep -Eo ' .+'`" && \
		echo "当前分支:$$branch" && \
		echo "说明:${memo}" && \
		echo "fetch 分支中......" && \
		git fetch -p --quiet && \
		echo "fetch 分支成功" && \
		git checkout main && \
		git pull origin main --rebase && \
		git checkout $$branch && \
		export precommitid=`git merge-base main $$branch` && \
		export revcommitid=`git rev-parse HEAD` && \
		export prmemo="${memo}" && \
		echo "[$$branch] 目标分支: main" && \
		echo "公共commit:$$precommitid" && \
		echo "最后commit:$$revcommitid"; bash ./makefetch.sh $$branch main $$precommitid $$revcommitid ${memo};
