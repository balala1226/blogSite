import '../style/AllPostView.css'
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import BlogPostTile from './BlogPostTile';

AllPostView.propTypes = {
  authenticated: PropTypes.bool
}

export default function AllPostView(){
  const [allPosts, setAllPosts] = useState([]);
  
  useEffect(() => {
    fetchAllBlogPostData();
  },[]);

  const fetchAllBlogPostData = async() =>{
    const req = await fetch('http://localhost:8080/api/all_blogs');
    
    if(!req){
      return;
    }
    const data = await req.json();

    if (req.status !== 200){
      console.log("fetch error");
      return;
    }

    var newAllPost = data.blogPosts;

    setAllPosts(newAllPost);
  }

  return(
    <>
      <div className='content'>
        <h1>All Posts</h1>
        <div className='allPostContainer'>
          {allPosts.map((currentPost, index) => (
            <BlogPostTile  key={index} blogPost={currentPost}></BlogPostTile>
          ))}
        </div>
      </div>
    </>
  )
}