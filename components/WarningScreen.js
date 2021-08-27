import React from 'react'
import {
    Container, Content, Header, Footer, Icon, Text
} from 'native-base'
export default class WarningScreen extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            Connected: this.props.isConnected,
            Reachable: this.props.isInternetReachable
        }
        this.setMessage = this.setMessage.bind(this)
    }
    static getDerivedStateFromProps(nextProps, prevState) {
        return { Connected: nextProps.isConnected, Reachable: nextProps.isInternetReachable }
    }
    setMessage() {
        if (!this.state.Connected) {
            return "You're not connected to internet"
        } else if (!this.state.Reachable) {
            return "Your internet connection is not Reachable"
        } else {
            return null
        }
    }
    componentDidMount() {

    }
    render() {
        return (
            <Container style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Icon name="warning" type="AntDesign" style={{ color: 'red' }}></Icon>
                <Text style={{ fontSize: 13, fontFamily: "Montserrat", }}>
                    {this.setMessage()}
                </Text>
            </Container>
        )
    }
}