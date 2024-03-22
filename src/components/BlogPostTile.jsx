import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import '../style/BlogPostTile.css'

BlogPostTile.propTypes = {
  blogPost: PropTypes.object
}

export default function BlogPostTile({blogPost}){
  return(
    <div className='blogPostTile'>
      <Link to={"/post/"+blogPost._id} className='blogPostTileLink'>
        {
          blogPost.blogImageUrl != '-' &&
          <div className='imageTileContainer'>
            <img className='itemImageTile' src={`https://pseudo-blog.adaptable.app/${blogPost.blogImageUrl}`}></img>
          </div>
        }
        <div className='textTileContainer'>
          <div className='itemNameTileContainer'>
            <p className='blogNameTile'>{blogPost.title}</p>
            <p className='blogAuthorTile'>by {blogPost.user.username}</p>
          </div>
        </div>
      </Link>
    </div>
  )
}