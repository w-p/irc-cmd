
all: commit publish

commit:
	git add .
	git commit -m '$(MESSAGE)'
	git push -u origin master

publish:
	npm publish .
