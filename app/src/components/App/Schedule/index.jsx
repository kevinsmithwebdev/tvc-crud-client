// ScheduleList
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import styles from './style.css'
import * as actionCreators from '../../../store/actions'
import * as selectors from '../../../store/selectors'
import ScheduleRow from './ScheduleRow'
import * as ku from '../../../lib/ke-utils'
// import ScheduleRow from './ScheduleRow'


/* edit button should only appear when admin is logged in */

class Schedule extends Component {
  componentDidMount() {

    this.props.requestReadScheduleMembers()
    this.props.requestReadExclusions()
    this.props.requestReadRoles()

  }

  handleSelectMember = (roleId, memberId) => {
    this.props.setSchedule({
      [roleId]: memberId === '' ? undefined : +memberId
    })
  }

  render() {
    const { scheduleMembers, roles, exclusions, upcomingSchedule } = this.props
    // ku.log('Schedule: scheduleMembers', scheduleMembers, 'blue')
    // ku.log('Schedule: roles', roles, 'blue')
    // ku.log('Schedule: exclusions', exclusions, 'blue')
    ku.log('upcomingSchedule', upcomingSchedule, 'blue')
    const scheduleList = scheduleMembers.map((m) => {
      const rMember = {
        memberId: m.member_id,
        sequence: m.sequence,
        firstName: m.first_name,
        lastName: m.last_name,
        lastServedDate: m.date,
        lastRoleId: m.role_id,
        lastRoleName: m.role_name,
        comment: m.comment,
        roles: getRoles(m.member_id),
      }
      return rMember
    })
    function getRoles (memberId) {
      let rRoles = roles.map((r) => {
        return {
          roleId: r.role_id,
          roleName: r.role_name,
          exempt: isExcluded(memberId, r.role_id)
        }
      })
      return rRoles
    }
    /*
        Returns true if the role is excluded for the given pair of memberId & roleId, otherwise returns false
     */
    function isExcluded(memberId, roleId) {
      const newArr = exclusions.filter((e) => {
        return (memberId === e.member_id && roleId === e.role_id)
      })
      if (newArr.length === 0) {
        return false
      } else if (newArr.length === 1) {
        return true
      } else {
        return false // should do something better than this
      }
    }
    const renderList = roles.map((r, index) => (
      <ScheduleRow
        key={index}
        role={r}
        memberId={upcomingSchedule[r.role_id] || '1'}
        scheduleList={scheduleList}
        selectMember={this.handleSelectMember}
      />
    ))
    ku.log('Schedule: scheduleList', scheduleList, 'blue')
    return (
      <div id='schedule' className={styles.schedule}>
        <Link to='/editvolunteer'><button id='editScheduleBtn'>Edit</button></Link>
        <h1 className={styles.title}>Volunteer Schedule for [date] </h1>
        {/* <ScheduleRow /> */}
        <div className={styles.row}>
          <div className={styles.memberDetail}>role</div>
          <div className={styles.memberDetail}>member</div>
          <div className={styles.memberDetail}>lastRole</div>
          <div className={styles.memberDetail}>comment</div>
          <div className={styles.memberDetail}>contact</div>
        </div>
        {renderList}
      </div>
    )
  }

}

const mapStateToProps = (state) => {
  const o = {
    scheduleMembers: selectors.getScheduleMembers(state),
    roles: selectors.getRoles(state),
    exclusions: selectors.getExclusions(state),
    upcomingSchedule: selectors.getUpcomingSchedule(state)
  }
  return o
}
export default connect(mapStateToProps, actionCreators)(Schedule)
