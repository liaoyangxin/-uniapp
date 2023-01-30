#!/bin/bash
echo -e "\033[33m 开始逻辑处理 \033[0m"
echo -e "\033[34m 当前分支:$1 \033[0m"
echo -e "\033[34m 目标分支:$2 \033[0m"
echo -e "\033[34m 公共 commitID:$3 \033[0m"
echo -e "\033[34m 最后 commitId:$4 \033[0m"
echo -e "\033[34m 备注:$5 \033[0m"
if [ -z $5 ]
then
    echo -e "\033[31m 未填写合并备注，请通过memo=方式进行添加 \033[5m"
    exit 0
fi
if [ $1 == "main" ]
then
    echo -e "\033[31m 不能在 main 分支上进行该操作 \033[5m"
    exit 0
fi
if [ $1 == "main" ]
then
    echo -e "\033[31m 不能在 main 分支上进行该操作 \033[5m"
    exit 0
fi
if [ $1 == $2 ]
then
    echo -e "\033[31m 两个分支相同，不能处理 \033[5m"
    exit 0
fi
if [ $3 != $4 ]
then
    echo -e "\033[32m 两个提交 ID 不一样，将进行整理处理 \033[0m"
    git reset --soft $3;
    git add .
    git commit -m "fetch:[$5]"
    git rebase $2
    git branch -D $2
    git pull origin $2 --rebase
    git merge $1
    git checkout $1 >/dev/null 2>&1
    git  --no-pager log --oneline -n 1
    echo -e "\033[32m 合并成功 \033[0m"
else
    echo -e "\033[33m 本分支无新提交，不能处理合并 \033[5m"
fi