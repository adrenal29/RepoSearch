const repoList = document.getElementById('repo-list');
const loader = document.getElementById('loader');
const reposPerPageSelect = document.getElementById('repos-per-page');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const bioPanel=document.getElementById('bioPanel')
const pages=document.getElementById('pages')
const search2=document.getElementById('search2')

let repos=[];
let reposPerPage = reposPerPageSelect.value;
let username=''
let currentPage = 1;
let profileLoaded=false;
async function profile(){
    const profileUrl=`https://api.github.com/users/${username}`;
    bioPanel.innerHTML = '';
    try{
        const response1=await fetch(profileUrl);
        const profile=await response1.json();
        console.log(profile)
        const avatar=document.createElement('img');
        avatar.className='avatar';
        avatar.src=profile.avatar_url
        bioPanel.appendChild(avatar)
        const title=document.createElement('h2')
        title.innerHTML=profile.name;
        const info=document.createElement('div');
        info.appendChild(title);
        bioPanel.appendChild(info)
        info.className='bioContent'
        const bio=document.createElement('p');
        bio.innerHTML=profile.bio==null?'Nothing in bio':profile.bio;
        info.appendChild(bio)
        const location=document.createElement('p');
        location.innerHTML=profile.location==null?'Location unknown':profile.location;
        info.appendChild(location)
        
        const twitter=document.createElement('p');
        twitter.innerHTML=`<b>Twitter</b>:${profile.twitter==null?'-':profile.twitter}`
        info.appendChild(twitter)
        addPaginationButtons(profile.public_repos)
        profileLoaded=true;

    }catch(err){
        console.log(err)
    }
}

async function fetchRepositories(page) {
    const inputUsername = document.getElementById('username').value.trim();
    if (!inputUsername) {
        alert('Please enter a valid Github username.');
        return;
    }
     reposPerPage = reposPerPageSelect.value;
    username = inputUsername;
    profile(username);
    const url = `https://api.github.com/users/${username}/repos?page=${page}&per_page=${reposPerPage}`;
   
    loader.style.display = 'block';
    repoList.innerHTML = '';

    try {
        addPaginationButtons(profile.public_repos,reposPerPage)
        const response = await fetch(url);
        const repositories = await response.json();
        displayRepositories(repositories);
        search2.style.display='inline'
        updatePaginationButtons(page);
        console.log(response.headers)
    } catch (error) {
        console.error('Error fetching repositories:', error);
        alert('Error fetching repositories. Please try again.');
    } finally {
        loader.style.display = 'none';
    }
}

function displayRepositories(repositories) {
    repositories.forEach(repo => {
        console.log(repo)
        if(repos.indexOf(repo)==-1)
        repos.push(repo)
        const divEl=document.createElement('div');
        const listItem = document.createElement('li');
        const desc=document.createElement('p');
        desc.innerHTML=repo.description==null?'Nothing in decription':repo.description
        listItem.textContent = repo.name;
        divEl.appendChild(listItem);
        divEl.appendChild(desc)
        repoList.appendChild(divEl)
        const topics=document.createElement('ul');
        repo.topics.forEach((topic)=>{
            const t=document.createElement('li');
            t.innerHTML=topic;
            topics.appendChild(t);
        })
        divEl.appendChild(topics);
        
    });
}


function addPaginationButtons(repoCount){
    let count=repoCount/reposPerPage;
    pages.innerHTML=''
    for(let i=0;i<count;i++){
        const pageNo=document.createElement('div');
        pageNo.style.border='1px solid black'
        pageNo.style.width='30%'
        pageNo.style.padding='10px'
        pageNo.style.cursor='pointer'
        pageNo.innerHTML=i+1;
        pageNo.addEventListener('click', function () {
            // Handle the click event, you can perform actions based on the page number
            fetchRepositories(i+1)
        });

        pages.appendChild(pageNo)
    }
}

function changePerPage() {
    fetchRepositories(1);
}

function updatePaginationButtons(page) {
    currentPage = page;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = repoList.children.length < reposPerPageSelect.value;
}
function filter(){
    
    let repoName=document.getElementById('reponame').value.trim()
    repoList.innerHTML=''
    const filteredRepos = repos.filter(repo =>
        repo.name.toLowerCase().includes(repoName.toLowerCase())
    );
    
     displayRepositories(filteredRepos)
}