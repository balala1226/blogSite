import {useEffect, useState} from 'react';
import { useParams } from "react-router-dom";
import { BlogPostModel } from '../models/BlogPostModel';
import BlogPostForm from './BlogPostForm';
import CommentForm from './CommentForm';
import CommentView from './CommentView';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

import '../style/BlogPost.css'
import { compareStringDateDescend } from '../helper/sortHelper';

BlogPostView.propTypes = {
  authenticated: PropTypes.bool,
  currentUser: PropTypes.object
}

export default function BlogPostView({authenticated, currentUser}){
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [blogPost, setBlogPost] = useState(new BlogPostModel());

  const {id} = useParams();
  const deleteApi = 'https://pseudo-blog.adaptable.app/api/delete_blog/';
  
  useEffect(() => {
    fetchBlogPostData();
  },[]);

  const fetchBlogPostData = async() => {
    const req = await fetch(`https://pseudo-blog.adaptable.app/api/get_blog/${id}`);
    
    if(!req){
      return;
    }
    const data = await req.json();

    if (req.status !== 200){
      console.log("post error");
      navigate('/error');
      return;
    }

    var newBlogPost = new BlogPostModel();
    newBlogPost.id = data.blogPost._id;
    newBlogPost.title = data.blogPost.title;
    newBlogPost.blogImageUrl = data.blogPost.blogImageUrl;
    newBlogPost.content = data.blogPost.content;
    newBlogPost.date = new Date(data.blogPost.date);
    newBlogPost.user = data.blogPost.user;
    newBlogPost.comments = data.blogPost.comments;
    newBlogPost.comments.sort(compareStringDateDescend);
    newBlogPost.isPublished = data.blogPost.isPublished;
    newBlogPost.reactions = data.blogPost.reactions;

    setBlogPost(newBlogPost);
  }

  const handleEditButton = (event) =>{
    event.preventDefault();

    setEditMode(true);
  };

  const handleDeleteButton = (event) =>{
    event.preventDefault();
    deletePost();
  };

  const deletePost = async() =>{
    const bearerToken = `Bearer ${currentUser.token}`;
    const deleteApiWithId = deleteApi+blogPost.id;
    const req = await fetch(
      deleteApiWithId,
      {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json',
            "Authorization": bearerToken,
        }
      }
    );

    navigate('/');
  }

  const formEditDone = (data) => {
    setEditMode(false);
  }

  const commentUpdate = (data) => {
    setBlogPost(data);
  }

  return(
    <>
      <div className='content'>
        <div className='blogContainer'>
          <div className='blogContent'>
            <div className='postTitleContainer'>
              <div className='postTitleItem'>
                <h1 className='blogTitle'>{blogPost.title}</h1>
              </div>
              <div className='postAuthorItem'>
                <p className='blogAuthor'>by {blogPost.user.username}</p>
                <p className='blogDate'>Uploaded on {`${blogPost.date.getMonth()+1}-${blogPost.date.getDate()}-${blogPost.date.getFullYear()} `}</p>
              </div>
            </div>
            {
              blogPost.blogImageUrl != '-' &&
              <div className='postImageContainer'>
                <img className='postImage' src={blogPost.blogImageUrl}></img>
              </div>
            }
            <div className='postContentContainer'>
                <p className='postContent'>{blogPost.content}</p>
            </div>
          </div>
          <div className='commentsContainer'>
            <p className='commentHeader'>Comments</p>
            { authenticated && 
              <CommentForm blogPost={blogPost} setBlogPost={commentUpdate} isNewComment={true} currentUser={currentUser}/>
            }
            {blogPost.comments.map((comment, index) => (
              <CommentView  key={index} comment={comment}></CommentView>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}