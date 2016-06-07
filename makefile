
all: bump publish

bump:
	npm version patch

publish:
	npm publish .
