from flask import Flask,jsonify,request
import requests
import json
app = Flask(__name__)

@app.route('/api/get-data', methods=['POST'])
def get_data():
      

    try:

        data= request.json
        owner = data['username']
        repo = data['repo']
        contributor_url = f"https://api.github.com/repos/{owner}/{repo}/contributors"
        review_url = f"https://api.github.com/repos/{owner}/{repo}/pulls/4/reviews"
    
        contributors_response = requests.get(contributor_url)
        review_response = requests.get(review_url)
        reviewer_data = {}
        if review_response.ok:
            review_data = review_response.json()
            reviews_data = [review["user"] for review in review_data]
            reviewer_name = [review["login"] for review in reviews_data]
            for name in reviewer_name:
                reviewer_data[name]+=1
        else:
            return jsonify({'error': 'Failed to fetch url response'})
        # contributors_response.raise_for_status()
        response_data = []
        if contributors_response.ok:
            contributors_data = contributors_response.json()
            contributors = [contributor["login"] for contributor in contributors_data]
        else:
            return jsonify({'response':contributors_response})
        for contributor in contributors:
            pr_merge_response = requests.get(f"https://api.github.com/search/issues?q=is:pr+repo:{owner}/{repo}+author:{contributor}+is:merged")
            pr_open_response = requests.get(f"https://api.github.com/search/issues?q=is:pr+repo:{owner}/{repo}+author:{contributor}+is:open")
            pr_close_response = requests.get(f"https://api.github.com/search/issues?q=is:pr+repo:{owner}/{repo}+author:{contributor}+is:closed")
            pr_merge_response.raise_for_status()
            pr_open_response.raise_for_status()
            pr_close_response.raise_for_status()

            contributor_commit_response = requests.get(f"https://api.github.com/repos/{owner}/{repo}/commits?author={contributor}") 
            contributor_commit_response.raise_for_status()
            if  contributor_commit_response.ok and pr_merge_response.ok and pr_open_response.ok and pr_close_response.ok:
                pr_merge_response=pr_merge_response.json()
                pr_open_response=pr_open_response.json()
                pr_close_response=pr_close_response.json()
                contributor_commit_response=contributor_commit_response.json()
                data={}
                data["owner"]=owner
                data["author"]=contributor
                data["line_changed"]=0
                files=set()
                data["pr_merged"]=pr_merge_response["total_count"]
                data["total_pr"]=pr_open_response["total_count"]+pr_close_response["total_count"]
                data["reviews_done"]=0

                for commit in contributor_commit_response:
                    url = commit["url"]
                    url_response = requests.get(url)
                    url_response.raise_for_status()
                    if url_response.ok:
                        url_response=url_response.json()
                        data["line_changed"]+=url_response["files"][0]["changes"]
                        files.add(url_response["files"][0]["filename"])
                    else:
                        return jsonify({'error': 'Failed to fetch url response'})
                data["file_changed_stats"]=len(files)
                data["reviews_done"]=reviewer_data[contributor]
                response_data.append(data)
            else:
                return jsonify({'error': 'Failed to fetch contributors commit data'})
        if response_data:
            return response_data
        else:
            return jsonify({'error': 'Failed to fetch data from API'})
    except Exception as e:
        return jsonify({'error': f'Error: {str(e)}'}), 500

if __name__== "__main__":
    app.run(debug=True)