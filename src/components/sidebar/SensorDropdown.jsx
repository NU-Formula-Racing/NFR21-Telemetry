import React, {Component} from 'react';
import Select from 'react-select'

export default class SensorDropdown extends Component{
    constructor(props){
        super(props)

        // all available sensor options
        this.options = ExampleSensorsByGroups.map((e1) => (e1.group === this.props.selectedGroup ? e1.sensors.map((e2) => ({value: e2, label: e2})) : [])).flat();
        // only sensors selected by user from available options
        this.selected = []
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedGroup !== this.props.selectedGroup) {
            this.updateSelected([])
            this.updateOptions(this.props.selectedGroup)
        }
    }

    updateOptions(newSelectedGroup) {
        this.options = ExampleSensorsByGroups.map((e1) => (e1.group === newSelectedGroup? e1.sensors.map((e2) => ({value: e2, label: e2})) : [])).flat()
    }

    updateSelected(values){
        this.props.setCurrentSensors(values);
    }

    render() {
        return (
            <>
                <Select
                    closeMenuOnSelect={false}
                    placeholder={"Select from " + this.props.selectedGroup + "..."}
                    isMulti={true}
                    options={this.options}
                    value={this.props.selectedSensors}
                    onChange={(x) => this.updateSelected(x)}
                    styles={{
                        multiValueLabel: (base) => ({
                            ...base,
                            width:'100px',
                            //height:'50px',
                            'fontSize':'16px'
                        }),
                    }}
                />
            </>
        )
    }
}

//{this.selected.map((x) => (<p>{x.label}</p>))}
let ExampleSensorsByGroups = [
    {group:"Safety Sensors", sensors: ["Sensor A", "Sensor B", "Sensor C", "Sensor Q", "Sensor R", "Sensor S", "Sensor T", "Sensor U", "Sensor V"]},
    {group:"Chasis Sensors", sensors: ["Sensor D", "Sensor E", "Sensor F"]},
    {group:"Aero Sensors", sensors: ["Sensor G", "Sensor H", "Sensor I"]},
    {group:"Suspension Sensors", sensors: ["Sensor J", "Sensor K", "Sensor L"]},
    {group:"Powertrain Sensors", sensors: ["Sensor M", "Sensor N", "Sensor O"]}
];