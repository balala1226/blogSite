import {useState} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import '../style/CommentForm.css'
import { CommentModel } from '../models/CommentModel';

CommentForm.propTypes = {
  blogPost: PropTypes.object,
  setBlogPost: PropTypes.func,
  isNewComment: PropTypes.bool,
  currentUser: PropTypes.object,
}

export default function CommentForm({blogPost, setBlogPost, isNewComment, currentUser}){
    const [commentError, setCommentError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const validationSchema = Yup.object().shape({
        content: Yup.string()
            .required('Content is required')
            .min(1, 'Content must at least have a character'),
        userId: Yup.string(),
    });

    const formOptions = {resolver: yupResolver(validationSchema)};

    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    const createCommentApi = 'https://pseudo-blog.adaptable.app/api/create_comment';
    const updateCommentApi = 'https://pseudo-blog.adaptable.app/api/update_comment/';

    const submitForm = async (data, e) => {
        try {
            const payloadData ={
                content: data.content,
                userId: data.userId,
                blogPostId: blogPost.id
            }
            const formData = JSON.stringify(payloadData);
            const bearerToken = `Bearer ${currentUser.token}`
    
            var apiToUse = '';
            var method = 'post';
            if (isNewComment)
            {
                apiToUse = createCommentApi;
            } else {
                apiToUse = updateCommentApi+blogPost.id;
                method = 'put';
            }

            const req = await fetch(
                apiToUse,
                {
                    method: method,
                    headers: {
                        'Content-Type': 'application/json',
                        "Authorization": bearerToken,
                    },
                    body: formData,
                }
            );

            const jsonResponse = await req.json();

            if (req.status !== 200){
                setErrorMessage(jsonResponse.errorMessage);
                setCommentError(true);
                console.log("comment error");
                return;
            }

            var newComment = new CommentModel();
            newComment.id = jsonResponse.comment._id;
            newComment.username = jsonResponse.comment.user.username;
            newComment.content = jsonResponse.comment.content;
            newComment.date = new Date(jsonResponse.comment.date);
  
            var newBlogPost = blogPost;
            newBlogPost.comments.push(newComment);

            setBlogPost(newBlogPost);
        }catch(err){
            console.log(e);
            console.log(err);
        }
    };

    return(
        <>
        <form className='commentForm' onSubmit={handleSubmit(submitForm)}>
            {/* <label htmlFor="content">New Comment:</label> */}
            <textarea  name="content" rows="6" cols="50" placeholder='New Comment'  {...register("content")}></textarea>
            {/* <div className={`${errors.username ? 'errorContainer' : 'hideDiv'}`}>{errors.username?.message}</div> */}

            <input name="userId" type="hidden" value={currentUser.id} {...register("userId")}/>
            <button className='confirmButton' type="submit">Submit</button>
            {commentError && <p>{errorMessage}</p>}
        </form>
        </>
    )
}