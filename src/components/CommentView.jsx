import { useState } from 'react';
import '../style/CommentView.css'
import PropTypes from 'prop-types';

CommentView.propTypes = {
  comment: PropTypes.object
}

export default function CommentView({ comment }){
  const [date, setDate] = useState(new Date(comment.date))
  return(
    <>
      <div className='commentContainer'>
        <p className='commenter'>{comment.user.username}</p>
        <p className='commentContent'>{comment.content}</p>
        <p className='commentDate'>{`${date.getMonth()+1}-${date.getDate()}-${date.getFullYear()} `}</p>
      </div>
    </>
  )
}