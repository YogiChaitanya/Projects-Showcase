import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Project from '../Project'
import './index.css'

// This is the list (static data) used in the application. You can move it to any component if needed.
const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectsShowcase extends Component {
  state = {
    activeTabId: categoriesList[0].id,
    listOfProjects: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectsList()
  }

  getProjectsList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })

    const {activeTabId} = this.state
    const url = `https://apis.ccbp.in/ps/projects?category=${activeTabId}`
    const option = {
      method: 'GET',
    }
    const response = await fetch(url, option)

    if (response.ok === true) {
      const data = await response.json()
      console.log(data)
      const updatedData = data.projects.map(eachItem => ({
        id: eachItem.id,
        name: eachItem.name,
        imageUrl: eachItem.image_url,
      }))
      this.setState({
        listOfProjects: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  onChangeSelectBtn = event => {
    this.setState(
      {
        activeTabId: event.target.value,
      },
      this.getProjectsList,
    )
  }

  renderLoading = () => (
    <div data-testid="loader" className="products-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        className="failure-view"
        alt="failure view"
      />

      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>

      <button
        onClick={this.getProjectsList}
        className="retry-btn"
        type="button"
      >
        Retry
      </button>
    </div>
  )

  renderSuccessView = () => {
    const {listOfProjects} = this.state
    return (
      <div className="success-view-container">
        <ul className="list-container">
          {listOfProjects.map(eachProject => (
            <Project key={eachProject.id} projectDetails={eachProject} />
          ))}
        </ul>
      </div>
    )
  }

  renderAllData = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoading()
      default:
        return null
    }
  }

  render() {
    const {activeTabId} = this.state
    return (
      <div className="projects-showcase-container">
        <div className="nav-menu">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            className="website-logo"
            alt="website logo"
          />
        </div>

        <ul className="selection-container">
          <select
            onChange={this.onChangeSelectBtn}
            value={activeTabId}
            id="selectionBtn"
          >
            {categoriesList.map(eachTabSelect => (
              <option value={eachTabSelect.id} key={eachTabSelect.id}>
                {eachTabSelect.displayText}
              </option>
            ))}
          </select>
        </ul>

        {this.renderAllData()}
      </div>
    )
  }
}

export default ProjectsShowcase
