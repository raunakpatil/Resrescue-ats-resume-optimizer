export async function scrapeGithub(url) {
  if (!url) return null;

  try {
    // Basic regex to extract username from url
    const match = url.match(/github\.com\/([a-zA-Z0-9-]+)/i);
    if (!match) return null;
    
    const username = match[1];
    
    // Fetch repos
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
    if (!response.ok) return null;
    
    const repos = await response.json();
    
    // Process and filter
    const topRepos = repos
      .filter(repo => !repo.fork) // ignore forks if possible, but keep it simple
      .map(repo => ({
        name: repo.name,
        description: repo.description || "",
        language: repo.language || "",
        stars: repo.stargazers_count || 0,
        url: repo.html_url
      }))
      .slice(0, 3); // top 3
      
    if (topRepos.length === 0) return null;
    
    return {
      username,
      repos: topRepos
    };
  } catch (err) {
    console.warn("Failed to scrape GitHub:", err);
    return null;
  }
}
