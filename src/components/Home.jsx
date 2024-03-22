import '../style/Home.css'
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import BlogPostTile from './BlogPostTile';
import homeImage from '../assets/images/homeImage.jpg';

export default function Home(){
  const [allPosts, setAllPosts] = useState([]);
  
  useEffect(() => {
    fetchAllBlogPostData();
  },[]);

  const fetchAllBlogPostData = async() =>{
    const req = await fetch('https://pseudo-blog.adaptable.app/api/all_blogs');
    
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
        <div className='homeContent'>
          <div className='homeContentGroup'>
            <h1>Welcome to this blog</h1>
            <p className='homeDescription'>This is blog portfolio. All posts are fetched in my own server.</p>
          </div>
          <div className='homeContentGroup'>
            <div className='homeImageContainer'>
              <img className='homeImage' src={homeImage} alt='homeImage'/>
            </div>
            <p><a href="https://www.freepik.com/free-vector/publish-article-concept-illustration_12704383.htm#query=blog&position=13&from_view=keyword&track=sph&uuid=75947b44-f554-40b8-bca2-dc91011e54c0">Image by storyset</a> on Freepik</p>              
          </div>
        </div>
      </div>
    </>
  )
}