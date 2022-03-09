import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import { withAuth0 } from '@auth0/auth0-react';

class MemeEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentMeme: ''
    }
  }
  saveToDb = async (meme, boxes) => {
    console.log(meme);
    try {
      let newMeme = {
        userName: this.props.auth0.user.email,
        url: meme.url,
        page_url: meme.page_url,
        boxes: boxes,
        template: this.props.template
      }
      let url = process.env.REACT_APP_SERVER_URL;
      let storedMeme = await axios.post(url, newMeme);
      console.log(storedMeme);

    } catch (error) {
      console.log(error); 
      
    }
  }
  sendMemeRequest = async (requestBody) => {
    try {
      let meme = await axios({
        method: 'post',
        url: `${process.env.REACT_APP_SERVER_URL}/memes`,
        data: requestBody,
        header: { 'Content-type': 'application/json' }
      })
      this.setState({
        currentMeme: meme
      })
      this.saveToDb(meme, requestBody.boxes);
    } catch (error) {
      console.log(error.message);
    }
  };

  handleSaveMeme = (event) => {
    event.preventDefault();
    let boxes = [];
    for (let i = 1; i <= this.props.template.box_count; i++) {
      boxes.push(
        { text: event.target[`num${i}box`].value }
      )
    }
    let requestObj = {
      template_id: this.props.template.id,
      boxes: boxes
    }
    this.sendMemeRequest(requestObj);
  }

  render() {
    let boxCount = this.props.template.box_count;
    let formControls = [];
    for (let i = 1; i <= boxCount; i++) {
      formControls.push((
        <Form.Group key={i} controlId={`num${i}box`}>
          <Form.Label>box{i}</Form.Label>
          <Form.Control type={`${i}box`} />
        </Form.Group>
      ))
    }

    return (
      <Form onSubmit={this.handleSaveMeme}>
        {formControls}
        <Button type='submit'>Save</Button>
        {/* <Button type='submit'>Preview</Button> */}
      </Form>
    )
  }
}

export default withAuth0(MemeEdit);
