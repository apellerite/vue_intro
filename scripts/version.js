#!/usr/bin/env node

/* eslint-disable no-console */
const path = require('path');
const { Octokit } = require('@octokit/rest');
const pkg = require('../package.json');
const pkgLock = require('../package-lock.json');
const changelog = require('../CHANGELOG.md');

if (!process.env.GH_TOKEN) {
  console.log('Could not find auth token.');
  process.exit(0);
}

const pullRequest = path.basename(process.env.CIRCLE_PULL_REQUEST || '');

if (!pullRequest) {
  console.log('No open pull request found.');
  process.exit(0);
}

const github = new Octokit({
  auth: process.env.GH_TOKEN,
});

const owner = 'pendo-io';
const repo = 'components';
const branch = process.env.CIRCLE_BRANCH;

async function getCurrentCommit() {
  const { data: refData } = await github.getRef({
    owner,
    repo,
    ref: `heads/${branch}`,
  });
  const commitSha = refData.object.sha;
  const { data: commitData } = await github.getCommit({
    owner,
    repo,
    commit_sha: commitSha,
  });

  return {
    commitSha,
    treeSha: commitData.tree.sha,
  };
}

async function createNewTree(sha) {
  const paths = [pkg, pkgLock, changelog];
  const treeStruct = {
    mode: '100644',
    type: 'blob',
    sha,
  };
  const tree = paths.map(file => ({
    path: file,
    ...treeStruct,
  }));

  return (await github.createTree({
    owner,
    repo,
    tree,
  })).data;
}

async function createNewCommit(message, currentTreeSha, currentCommitSha) {
  return (await github.createCommit({
    owner,
    repo,
    message,
    tree: currentTreeSha,
    parents: [currentCommitSha],
  })).data;
}

async function setBranchToCommit(sha) {
  github.updateRef({
    owner,
    repo,
    ref: `refs/heads/${branch}`,
    sha,
  });
}

async function uploadToRepo() {
  const currentCommit = await getCurrentCommit();
  const newTree = await createNewTree(currentCommit.treeSha);
  const commitMessage = `Update version and changelog to ${pkg.version}`;
  const newCommit = await createNewCommit(
    commitMessage,
    newTree.sha,
    currentCommit.commitSha,
  );
  await setBranchToCommit(newCommit.sha);
}

uploadToRepo();
