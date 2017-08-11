import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import color from '@cdo/apps/util/color';
import CourseOverviewTopRow from './CourseOverviewTopRow';
import DropdownButton from '@cdo/apps/templates/DropdownButton';
import Button from '@cdo/apps/templates/Button';
import ResourceType, { stringForType, resourceShape } from './resourceType';

const styles = {
  box: {
    marginTop: 10,
    border: '1px solid ' + color.light_gray,
    padding: 10
  },
  error: {
    color: 'red',
  }
};

const defaultLinks = {
  '': '',
  [ResourceType.teacherForum]: 'https://forum.code.org/',
  [ResourceType.curriculum]: '/link/to/curriculum',
  [ResourceType.professionalLearning]: '/link/to/professional/learning',
  [ResourceType.lessonPlans]: '/link/to/lesson/plans',
  [ResourceType.vocabulary]: '/link/to/vocab',
  [ResourceType.codeIntroduced]: '/link/to/code/introduced',
  [ResourceType.standardMappings]: '/link/to/standard/mappings',
  [ResourceType.allHandouts]: '/link/to/all/handouts',
  [ResourceType.videos]: '/link/to/videos',
};

export default class ResourcesEditor extends Component {
  static propTypes = {
    inputStyle: PropTypes.object.isRequired,
    resources: PropTypes.arrayOf(resourceShape).isRequired,
    maxResources: PropTypes.number.isRequired,
    isCourse: PropTypes.bool.isRequired,
  };

  constructor(props) {
    super(props);

    const resources = [...props.resources];
    // add empty entries to get to max
    while (resources.length < props.maxResources) {
      resources.push({type: '', link: ''});
    }

    this.state = {
      resources,
      errorString: ''
    };
  }

  handleChangeType = (event, index) => {
    const oldResources = this.state.resources;
    const newResources = _.cloneDeep(oldResources);
    const type = event.target.value;
    newResources[index].type = type;

    if (oldResources[index].link === defaultLinks[oldResources[index].type]) {
      newResources[index].link = defaultLinks[type];
    }

    let errorString = '';
    let types = newResources.map(resource => resource.type).filter(resource => resource);
    if (types.length !== _.uniq(types).length) {
      errorString = 'Your resource types contains a duplicate';
    }

    this.setState({resources: newResources, errorString});
  }

  handleChangeLink = (event, index) => {
    const newResources = _.cloneDeep(this.state.resources);
    const link = event.target.value;
    newResources[index].link = link;
    this.setState({resources: newResources});
  }

  render() {
    const { resources, isCourse, errorString } = this.state;

    // avoid showing multiple empty reosurces
    const lastNonEmpty = _.findLastIndex(resources, ({type, link}) => link && type);

    return (
      <div>
        {resources.slice(0, lastNonEmpty + 2).map((resource, index) =>
          <Resource
            key={index}
            id={index + 1}
            resource={resource}
            inputStyle={this.props.inputStyle}
            handleChangeType={event => this.handleChangeType(event, index)}
            handleChangeLink={event => this.handleChangeLink(event, index)}
          />
        )}

        <div style={styles.box}>
          <div style={styles.error}>{errorString}</div>
          <div style={{marginBottom: 5}}>Preview:</div>
          {isCourse &&
            <CourseOverviewTopRow
              sectionsInfo={[]}
              id={-1}
              title="Unused title"
              resources={resources.filter(x => !!x.type)}
            />
          }
          {!isCourse &&
            <DropdownButton
              text="Teacher resources"
              color={Button.ButtonColor.blue}
            >
            {resources.filter(x => !!x.type).map(({type, link}, index) =>
              <a key={index} href={link}>{stringForType[type]}</a>
            )}
            </DropdownButton>
          }
        </div>
      </div>
    );
  }
}

const Resource = ({id, resource, inputStyle, handleChangeType, handleChangeLink}) => (
  <div style={{marginTop: 8}}>
    Resource {id}
    <div>
      Type
    </div>
    <select
      name="resourceTypes[]"
      style={inputStyle}
      value={resource.type}
      onChange={handleChangeType}
    >
      <option value={''} key={-1}>None</option>
      {Object.keys(ResourceType).map((type, index) =>
        <option value={type} key={index}>{stringForType[type]}</option>
      )}
    </select>
    <div>
      Link
    </div>
    <input
      style={inputStyle}
      name="resourceLinks[]"
      value={resource.link}
      onChange={handleChangeLink}
    />
  </div>
);
Resource.propTypes = {
  id: PropTypes.number.isRequired,
  resource: PropTypes.shape({
    type: PropTypes.oneOf([...Object.values(ResourceType), '']).isRequired,
    link: PropTypes.string.isRequired,
  }).isRequired,
  inputStyle: PropTypes.object.isRequired,
  handleChangeType: PropTypes.func.isRequired,
  handleChangeLink: PropTypes.func.isRequired,
};
