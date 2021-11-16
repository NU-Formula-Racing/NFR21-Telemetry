import React, {Component} from 'react';
import Select from 'react-select';
import styled from "styled-components";

export default class SensorDropdown extends Component{
    constructor(props){
        super(props)
        // the current selected drop down group
        this.state = {selectedGroup: this.props.selectedGroup, selectedSensors: this.props.selectedSensors}
        // all available sensor options
        this.options = []
        // only sensors selected by user from available options
        this.selected = []
    }

    componentDidUpdate(prevProps) {                                           
        if (prevProps.selectedGroup !== this.props.selectedGroup) {
            this.updateSelectedGroup(this.props.selectedGroup)
            this.updateOptions(this.props.selectedGroup)

        }
    }
    updateSelectedGroup(newSelectedGroup) {
        this.setState({selectedGroup: newSelectedGroup}) 
    }
    updateOptions(newSelectedGroup) {
        this.options = ExampleSensorsByGroups.map((e1) => (e1.group === newSelectedGroup? e1.sensors.map((e2) => ({value: e2, label: e2})) : [])).flat()

    }
    addSelected(value){
        console.log(value)
        console.log(this.state.selectedSensors)
        console.log(this.state.selectedSensors.indexOf(value[0]))
        if (value != null && -1 == this.state.selectedSensors.indexOf(value[0])){
          this.setState({selectedSensors: this.state.selectedSensors.concat(value)})
        }
    }

    
    removeSelected(value){
        return
    }

    render() {
        return (
            <>
                <Select
                closeMenuOnSelect={false}
                placeholder={"Select from " + this.props.selectedGroup + "..."}
                isMulti={true}
                options={this.options}
                value={this.state.selectedGroup}
                onChange={(x) => this.addSelected(x)}
                styles={{
                    multiValueLabel: (base) => ({
                      ...base,
                      width:'100px',
                      //height:'50px',
                      'font-size':'16px'
                    }),
                  }}
                />
                <SmallVertSpace/>
                {this.state.selectedSensors.map((e) => (<StyledButton>{e.label}</StyledButton>))}
            </>



        )
    }
}

//{this.selected.map((x) => (<p>{x.label}</p>))}
let ExampleSensorsByGroups = [
    {group:"Saftey Sensors", sensors: ["Sensor A", "Sensor B", "Sensor C", "Sensor Q", "Sensor R", "Sensor S", "Sensor T", "Sensor U", "Sensor V"]},
    {group:"Chasis Sensors", sensors: ["Sensor D", "Sensor E", "Sensor F"]},
    {group:"Aero Sensors", sensors: ["Sensor G", "Sensor H", "Sensor I"]},
    {group:"Suspension Sensors", sensors: ["Sensor J", "Sensor K", "Sensor L"]},
    {group:"Powertrain Sensors", sensors: ["Sensor M", "Sensor N", "Sensor O"]}
  ];



let StyledButton = styled.button`
  width: 200px;
  height: 30px;
`
let SmallVertSpace = styled.div`
  height: 20px;
`