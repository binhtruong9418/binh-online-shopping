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

const listComment = ({listComment}: any) => (
    <CommentGroup style={{width: '100%'}}>
        <Header as='h3' dividing>
            {listComment.length} Comments
        </Header>

        <div style={{height: 500, overflow: 'auto', gap: '10px'}} className={'d-flex flex-column'}>
            {
                listComment.map((e: any) => (
                    <Comment>
                        <CommentAvatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
                        <CommentContent>
                            <CommentAuthor as='a'>Anonymous</CommentAuthor>
                            <CommentMetadata>
                                <div>
                                    {moment(e.time).fromNow()}
                                </div>
                            </CommentMetadata>
                            <CommentText>{e.text}</CommentText>
                        </CommentContent>
                    </Comment>
                ))
            }
        </div>

        <Form reply>
            <FormTextArea />
            <Button content='Bình luận' labelPosition='left' icon='edit' primary />
        </Form>
    </CommentGroup>
)

export default listComment
