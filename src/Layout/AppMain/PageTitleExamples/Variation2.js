import React, { Component, Fragment } from 'react';
import {
    UncontrolledDropdown, DropdownToggle, DropdownMenu, UncontrolledTooltip,
    Nav, NavItem, NavLink, Button
} from 'reactstrap';
import { faFilePdf, faPlus, faSave, faBusinessTime, faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class TitleComponent2 extends Component {

    state = {
        options: null
    }

    componentDidMount() {
        if (this.props.options) {
            this.setState((state, props) => ({ options: props.options }))
        }
    }

    toggle(name) {
        this.setState({
            [name]: !this.state[name],
            progress: 0.5,
        })
    }

    renderIcon = (icon) => {
        switch (icon) {
            case 'pdf': return faFilePdf
            case 'save': return faSave
            case 'plus': return faPlus
            case 'import': return faFileImport
        }
    }

    render() {
        let { options } = this.state
        if (options === null) {
            return ''
        } else {
            return (
                <Fragment>
                    {options.map(option => (
                                <Fragment>
                                    <Button className="btn-shadow ml-2" onClick={option.action} color={option.color} id={option.id}>
                                        <FontAwesomeIcon icon={this.renderIcon(option.icon)} />
                                    </Button>
                                    <UncontrolledTooltip placement="left" target={option.id}>
                                        {option.msmTooltip}
                                    </UncontrolledTooltip>
                                </Fragment>))
                    }
                </Fragment>
            );
        }
    }
}
