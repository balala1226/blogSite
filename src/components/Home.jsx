import '../style/Home.css'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BlogPostTile from './BlogPostTile';

export default function Home(){
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
      </div>
    </>
  )
}