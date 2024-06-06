import moment from "moment";
import {useState} from "react";
import {toast} from "react-toastify";
import DysonApi from "../axios/DysonApi.ts";
import {Avatar, Button, Divider, Input} from "antd";
// import 'semantic-ui-css/semantic.min.css'

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
        if (!commentContent) {
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
        <div style={{width: '100%', marginTop: 30}}>
            <h3>
                {listComment.length} Comments
            </h3>
            <Divider/>

            <div style={{maxHeight: 500, overflow: 'auto', gap: '10px'}} className={'d-flex flex-column'}>
                {
                    listComment.map((e: any) => (
                        <div className={'d-flex'}>
                            <Avatar
                                className={'mr-2'}
                                src='https://react.semantic-ui.com/images/avatar/small/matt.jpg'/>
                            <div>
                                <div className={'d-flex align-items-center'}>
                                    <div className={'mr-2'}>Anonymous</div>
                                    <div style={{color: 'gray', fontSize: 12}}>
                                        {moment(e.createdAt).fromNow()}
                                    </div>
                                </div>

                                <div>{e.content}</div>
                            </div>
                        </div>
                    ))
                }
            </div>

            <Divider/>
            {
                canComment && (
                    <div className={'mt-3 d-flex flex-column'}>
                        <Input.TextArea
                            style={{width: 400}}
                            value={commentContent}
                            onChange={(e) => {
                                setCommentContent(e.target.value)
                            }}
                            placeholder={'Nhập nội dung bình luận'}
                            autoSize={{minRows: 3, maxRows: 5}}
                        />
                        <Button
                            style={{width: 100, marginTop: 10}}
                            onClick={handleComment}
                            type={'primary'}
                            size={'large'}
                        >
                            Bình luận
                        </Button>
                    </div>
                )
            }
        </div>
    )
}

export default listComment
