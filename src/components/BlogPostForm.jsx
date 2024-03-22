import {useState} from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import PropTypes from 'prop-types';

import '../style/BlogPostForm.css'
import { BlogPostModel } from '../models/BlogPostModel';
import { compareStringDateDescend } from '../helper/sortHelper';

BlogPostForm.propTypes = {
  blogPost: PropTypes.object,
  setBlogPost: PropTypes.func,
  formEditDone: PropTypes.func,
  currentUser: PropTypes.object
}

export default function BlogPostForm({blogPost, setBlogPost, formEditDone, currentUser}){
    const [editError, setEditError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('')
    const [blogImage, setBlogImage] = useState()

    const validationSchema = Yup.object().shape({
        title: Yup.string()
            .required('Username is required')
            .min(1, 'Username must at least have a character'),
        content: Yup.string()
            .required('Password is required')
            .min(1, 'Content must at least have a character'),
        isPublished: Yup.bool(),
        userId: Yup.string()
    });

    const formOptions = {resolver: yupResolver(validationSchema)};

    const { register, handleSubmit, reset, formState } = useForm(formOptions);
    const { errors } = formState;

    const createPostApi = 'http://localhost:8080/api/create_blog';
    const updatePostApi = 'http://localhost:8080/api/update_blog/';

    const submitForm = async (data, e) => {
        var formData = new FormData();
        formData.append('title', data.title);
        formData.append('content', data.content);
        formData.append('isPublished', data.isPublished);
        formData.append('userId', data.userId);
        formData.append('blogImage', blogImage);

        const bearerToken = `Bearer ${currentUser.token}`

        try {
            var apiToUse = '';
            var method = 'post';
            if (blogPost.id == "")
            {
                apiToUse = createPostApi;
            } else {
                apiToUse = updatePostApi+blogPost.id;
                method = 'put';
            }

            const req = await fetch(
                apiToUse,
                {
                    method: method,
                    mode: 'cors',
                    headers: {
                        'Authorization': bearerToken,
                    },
                    body: formData,
                }
            );

            const jsonResponse = await req.json();

            if (req.status !== 200){
                setErrorMessage(jsonResponse.errorMessage);
                setEditError(true);
                console.log("post error");
                return;
            }
            
            var newBlogPost = new BlogPostModel();
            newBlogPost.title = jsonResponse.blogPost.title;
            newBlogPost.blogImageUrl = jsonResponse.blogPost.blogImageUrl;
            newBlogPost.content = jsonResponse.blogPost.content;
            newBlogPost.date = new Date(jsonResponse.blogPost.date);
            newBlogPost.user = jsonResponse.blogPost.user;
            newBlogPost.comments = jsonResponse.blogPost.comments;
            newBlogPost.comments.sort(compareStringDateDescend);
            newBlogPost.isPublished = jsonResponse.blogPost.isPublished;
            newBlogPost.reactions = jsonResponse.blogPost.reactions;
            newBlogPost.id = jsonResponse.blogPost._id;

            setBlogPost(newBlogPost);

            const data = {
                confirmed: true,
                id: newBlogPost.id
            }

            formEditDone(data);
        }catch(err){
            console.log(e);
            console.log(err);
        }
    };

    const handleEditCancelButton = (event) =>{
        event.preventDefault();

        const data = {
            confirmed: false,
            id: ''
        }

        formEditDone(data);
    };

    return(
        <form className='blogPostFormContainer' onSubmit={handleSubmit(submitForm)}>
            <label htmlFor="title">Title:</label>
            <input name="title" type="text" defaultValue={blogPost.title} {...register("title")}/>

            <label  htmlFor="blogImage">Image:</label>
            <input type="file" name="imageUrl" accept="image/*" onChange={(e) => setBlogImage(e.target.files[0])}/>

            <label  htmlFor="content">Content:</label>
            <textarea  name="content" rows="40" cols="50" defaultValue={blogPost.content}  {...register("content")}></textarea>

            <label  htmlFor="isPublished">Publish:
                <input className="publishCheckbox" name="isPublished" type='checkbox' defaultChecked={blogPost.isPublished} {...register("isPublished")}/>
            </label>
            <input name="userId" type="hidden" value={currentUser.id} {...register("userId")}/>
            <div className='editFormButtonContainer'>
            <button className='confirmButton' type="submit">Confirm</button>
            <button className='cancelButton' onClick={handleEditCancelButton}>Cancel</button>
            </div>
            {editError && <p>{errorMessage}</p>}
        </form>
    )
}