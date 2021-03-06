import React, { Component } from 'react'
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import * as actionCreators from '../../store/actions'
import * as selectors from '../../store/selectors'
import { Button } from 'react-bootstrap'
import styles from './style.css'
import Member from './Member'
import MemberEdit from './MemberEdit'
import * as ku from '../../lib/ke-utils'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      resultText: 'Do nothing to get started. The data should be below. Modify the data in this mosule on line 29 to send a new update. Refresh the page to see the update. That is, it will work once the .put is changed to use a promise like the .get is. After that, we need to have the put return the new data so the UI will update. That probably means re-reading the rows from the db from inside of the put and sending them back.'
    }
  }

  componentWillMount() {
    this.props.requestReadMembers()
  }

  render() {
    console.log('render', '', 'blue')
    const { readMembersRequest, members } = this.props;

    const buttonClick = (name) => {
      console.log(`button ${name} clicked`)
      //let val = name
      //this.setState({ resultText: val })
      // console.log(requestReadMembers)
      this.props.requestUpdateMember(3, {firstname:'Jack', lastname:'Smith', email:'email8@none.com'})
    }
    let renderMemberEdit = null
    const handleEditClick = (id) => {
      ku.log('Member.handleEditClick: id', id, 'blue')
      const member = members.filter((m) => {
        return m.member_id === id
      })
      renderMemberEdit = <MemberEdit
        key={id}
        member={member}
                         />

    }

    const buttons = (
      <div>
        <Button
          id="create"
          className={styles.button}
          bsStyle="primary"
          onClick={(event) => buttonClick(event.target.id)}>
          Create
        </Button>
        <Button
          id="read"
          className={styles.button}
          bsStyle="primary"
          onClick={(event) => buttonClick(event.target.id)}>
          Read
        </Button>
        <Button
          id="update"
          className={styles.button}
          bsStyle="primary"
          onClick={(event) => buttonClick(event.target.id)}>
          Update
        </Button>
        <Button
          id="delete"
          className={styles.button}
          bsStyle="primary"
          onClick={(event) => buttonClick(event.target.id)}>
          Delete
        </Button>
        <div className={styles.results}>
          {this.state.resultText}
        </div>
      </div>
    )
    let renderMembers = ''
    if (readMembersRequest.status === 'success') {
      renderMembers = members.map((m) => (
        <Member
          key={m.member_id}
          member_id={m.member_id}
          firstName={m.firstname}
          lastName={m.lastname}
          email={m.email}
          handleEditClick={handleEditClick}
        />
      ))
    } else {
      renderMembers = (<p>no members yet</p>)
    }

    return (

      <div id="app" className={styles.app}>
        {buttons}
        {renderMembers}
        {renderMemberEdit}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const o = {
    members: selectors.getMembers(state),
    readMembersRequest: selectors.getRequest(state, 'api/getReadMembers'),
  }
  return o
}
export default connect(mapStateToProps, actionCreators)(App);
