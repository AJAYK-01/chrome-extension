/**
 * The `orchestrator` function is responsible for orchestrating various actions based on the current URL of the tab.
 * 
 * Functionality:
 * 1. Logs the updated tab URL for debugging purposes.
 * 2. Checks if the user is logged in when on GitHub or Bitbucket. If not, a warning is displayed.
 * 3. Retrieves the 'backendUrl' from Chrome local storage.
 * 
 * For GitHub:
 * - If on a specific repository page (e.g., https://github.com/mui/mui-toolpad), it displays a floating action button.
 * - If on a repository's pull requests page, it highlights relevant PRs.
 * - If viewing files of a specific pull request, it highlights important files and specific code hunks.
 * - If on a user or organization's main page or repositories page, it updates the display of tracked repositories.
 * 
 * For Bitbucket:
 * - If on a workspace's repositories page, it updates the display of tracked repositories.
 * - If on a repository's pull requests page, it highlights relevant PRs or specific files and code hunks in a PR.
 * 
 * Note: This function assumes it's running in the context of a browser extension, given its use of the 'chrome.storage' API and specific URL patterns for GitHub and Bitbucket.
 */
const orchestrator = (tabUrl, websiteUrl, userId) => {
	console.debug(`[vibinex-orchestrator] updated url: ${tabUrl}`);
	const urlObj = tabUrl.split('?')[0].split('/');
	if (!userId && (urlObj[2] === 'github.com' || urlObj[2] === 'bitbucket.org')) {
		console.warn(`[Vibinex] You are not logged in. Head to ${websiteUrl} to log in`);
		// TODO: create a UI element on the screen with CTA to login to Vibinex
	}
	chrome.storage.local.get(["backendUrl"]).then(async ({ backendUrl }) => {
		if (urlObj[2] == 'github.com') {
			if (urlObj[3] && (urlObj[3] !== 'orgs') && urlObj[4]) {
				// for showing fav button if org repo is not added, eg : https://github.com/mui/mui-toolpad
				const ownerName = urlObj[3];
				const repoName = urlObj[4];
				showFloatingActionButton(ownerName, repoName, userId, websiteUrl, 'github');

				if (urlObj[5] === 'pulls') {
					// show relevant PRs
					const body = {
						"repo_owner": ownerName,
						"repo_name": repoName,
						"user_id": userId,
						"is_github": true
					}
					const url = `${backendUrl}/relevance/pr`;
					const highlightedPRIds = await apiCall(url, body);
					highlightRelevantPRs(highlightedPRIds);
				}
				if (urlObj[5] === "pull" && urlObj[6] && urlObj[7] === "files") {
					const prNumber = parseInt(urlObj[6]);
					const body = {
						"repo_owner": ownerName,
						"repo_name": repoName,
						"user_id": userId,
						"pr_number": prNumber,
						"is_github": true
					}
					const url = `${backendUrl}/relevance/pr/files`;
					const response = await apiCall(url, body);
					showImpFileInPr(response);

					const hunk_info_body = {
						"repo_owner": ownerName,
						"repo_name": repoName,
						"user_id": userId,
						"pr_number": prNumber,
						"repo_provider": "github"
					}
					const hunk_info_url = `${backendUrl}/relevance/hunkinfo`;
					const hunk_info_response = await apiCall(hunk_info_url, hunk_info_body);
					githubHunkHighlight(hunk_info_response);
				}
			}
			// for showing all tracked repo
			else if (
				(urlObj[3] && urlObj[4] == undefined) ||
				(urlObj[3] == 'orgs' && urlObj[4] && urlObj[5] === 'repositories')) {
				// for woking on this url https://github.com/Alokit-Innovations or https://github.com/orgs/Alokit-Innovations/repositories?type=all type 
				const orgName = (urlObj[3] === "orgs") ? urlObj[4] : urlObj[3];
				const trackedRepos = await getTrackedRepos(orgName, userId, 'github')
				updateTrackedReposInOrgGitHub(trackedRepos, websiteUrl);
			}
		}

		if (urlObj[2] === 'bitbucket.org') {
			// for showing tracked repo of a organization 
			if (urlObj[4] === 'workspace' && urlObj[5] === 'repositories') {
				const workspaceSlug = urlObj[3];
				const trackedRepos = await getTrackedRepos(workspaceSlug, userId, 'bitbucket')
				updateTrackedReposInBitbucketOrg(trackedRepos, websiteUrl);
			}

			if (urlObj[5] === "pull-requests") {
				const ownerName = urlObj[3];
				const repoName = urlObj[4];
				// for showing tracked pr of a repo 
				if (!urlObj[6]) {
					const body = {
						"repo_owner": ownerName,
						"repo_name": repoName,
						"user_id": userId,
						"repo_provider": "bitbucket"
					}
					const url = `${websiteUrl}/api/extension/relevant`;
					const query_params = {type: "review"};
					const highlightedPRIds = await apiCallOnprem(url, body, query_params);
					addCssElementToBitbucket(highlightedPRIds);
				}
				// for showing highlighted file in single pr and also for hunkLevel highlight 
				else if (urlObj[6]) {
					const prNumber = parseInt(urlObj[6]);
					const body = {
						"repo_owner": ownerName,
						"repo_name": repoName,
						"user_id": userId,
						"pr_number": prNumber,
						"repo_provider": 'bitbucket',
						"is_github": false
					}
					const url = `${websiteUrl}/api/extension/relevant`;
					let query_params = {type: "file"};
					const response = await apiCallOnprem(url, body, query_params);
					FilesInPrBitbucket(response);
					// for hunk level high light of each file 
					query_params = {type: "hunk"};
					const hunkResponse = await apiCallOnprem(url, body, query_params);
					bitBucketHunkHighlight(hunkResponse);
				}
			}
		}
	})
};