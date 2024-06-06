import {
    CommentText,
    CommentMetadata,
    CommentGroup,
    CommentContent,
    CommentAvatar,
    CommentAuthor,
    FormTextArea,
    Button,
    Comment,
    Form,
    Header,
} from 'semantic-ui-react'
import moment from "moment";
import {useState} from "react";
import {toast} from "react-toastify";
import DysonApi from "../axios/DysonApi.ts";

const listComment = (
    {
        listComment,
        canComment,
        refetchComment,
        cartId,
        productId
    }: any) => {
    const [commentContent, setCommentContent] = useState('')
    const handleComment = async () => {
        if(!commentContent) {
            return toast.error('Vui lòng nhập nội dung bình luận')
        }

        try {
            await DysonApi.createComment({
                commenterId: cartId,
                content: commentContent,
                productId
            })

            toast.success('Bình luận thành công')
            setCommentContent('')
            await refetchComment()
        } catch (e) {
            toast.error('Bình luận thất bại')
        }
    }
    return (
        <CommentGroup style={{width: '100%'}}>
            <Header as='h3' dividing>
                {listComment.length} Comments
            </Header>

            <div style={{maxHeight: 500, overflow: 'auto', gap: '10px'}} className={'d-flex flex-column'}>
                {
                    listComment.map((e: any) => (
                        <Comment>
                            <CommentAvatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg'/>
                            <CommentContent>
                                <CommentAuthor as='a'>Anonymous</CommentAuthor>
                                <CommentMetadata>
                                    <div>
                                        {moment(e.createdAt).fromNow()}
                                    </div>
                                </CommentMetadata>
                                <CommentText>{e.content}</CommentText>
                            </CommentContent>
                        </Comment>
                    ))
                }
            </div>

            {
                canComment && (
                    <Form reply>
                        <FormTextArea
                            value={commentContent}
                            onChange={(e) => {
                                setCommentContent(e.target.value)

                            }}/>
                        <Button onClick={handleComment} content='Bình luận' labelPosition='left' icon='edit' primary/>
                    </Form>
                )
            }
        </CommentGroup>
    )
}

export default listComment
