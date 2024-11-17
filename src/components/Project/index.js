import './index.css'

const Project = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails
  return (
    <li className="list-card">
      <img src={imageUrl} className="project-img" alt={name} />

      <p className="paragraph1">{name}</p>
    </li>
  )
}
export default Project
