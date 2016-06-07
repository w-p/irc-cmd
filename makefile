
all: push publish

bump:
	npm version patch

push:
	git push -u origin master

publish:
	npm publish .
