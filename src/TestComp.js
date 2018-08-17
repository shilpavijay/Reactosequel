import React, { Component } from 'react';

export class TestComp extends Component {
    constructor() {
        super()
        this.state = {
            rows: []
        }
        let self = this;
        fetch('http://127.0.0.1:5000/')
        .then(function(response) {
            let js = response.json()
            js.then(function(js) {
            self.setState({ rows: Object.values(js) });
            });
        });
    }

    add() {
        let rowIDs = this.state.rows.map(row => row.ID)
        let maxId = rowIDs.reduce((x,y) => x>y? x:y)
        let newRow = {Dept: 'Enter Dept Name', Age: 100, Sal: 0, ID: maxId+1, Name: 'Enter Name',  }
        this.setState({
            rows: [
                ...this.state.rows, newRow
                ]
        })
        
        fetch('http://127.0.0.1:5000/', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                Name: 'Enter Name',
                Age: 100,
                Sal: 0,
                Dept: 'Enter Dept Name'
                })
            })
    }

    update(id,pos,val) {
        let rowID = parseInt(id,10)
        let updRow = this.state.rows.filter(row => row.ID === rowID)
        updRow[0][pos] = val
        const idx = this.state.rows.findIndex(x => x.ID === rowID)
        //reload page data:
        this.setState({
            rows: [
                ...this.state.rows.slice(0,idx),
                ...updRow,
                ...this.state.rows.slice(idx+1)
                ]
        }) 
        // update database:
        fetch('http://127.0.0.1:5000/', {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ID: rowID,
                Name: updRow[0].Name,
                Age: updRow[0].Age,
                Sal: updRow[0].Sal,
                Dept: updRow[0].Dept
                })
            })
    }

    delete(id) {
        const idx = this.state.rows.findIndex(x => x.ID === parseInt(id,10))
        this.setState({
            rows: [
                ...this.state.rows.slice(0,idx),
                ...this.state.rows.slice(idx+1)
                ]
        }) 
        //delete from database:
        var url = 'http://127.0.0.1:5000/' + id + '/'
        fetch(url, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            }
            })
    }

    render() {
        return(
            <div>
                <table className="table is-striped is-hoverable has-text-primary">
                    <thead>
                    <tr>
                        <th>Sl#</th>
                        <th>Name</th>
                        <th>Age</th>
                        <th>Salary</th>
                        <th>Department</th>
                        <th></th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.state.rows.map(row => {
                        return (
                            <tr key={row.ID}>
                                <td>{row.ID}</td>
                                <td><input class="input is-primary is-rounded" maxLength="15" size="15" id={row.ID} type='text' value={row.Name} onChange={(e) => this.update(e.target.id,'Name',e.target.value)}/></td>
                                <td><input class="input is-primary is-rounded" maxLength="3" size="3"  id={row.ID} type='text' value={row.Age} onChange={(e) => this.update(e.target.id,'Age',e.target.value)}/></td>
                                <td><input class="input is-primary is-rounded" maxLength="7" size="7" id={row.ID} type='text' value={row.Sal} onChange={(e) => this.update(e.target.id,'Sal',e.target.value)}/></td>
                                <td><input class="input is-primary is-rounded" maxLength="15" size="15" id={row.ID} type='text' value={row.Dept} onChange={(e) => this.update(e.target.id,'Dept',e.target.value)}/></td>
                                <td><button class="button is-danger" id={row.ID} onClick={(e) => this.delete(e.target.id)}>-</button></td>
                            </tr>
                        )
                    })}
                    </tbody>    
                </table>
                <button class="button is-primary is-rounded" onClick={() => this.add()}>ADD</button>
            </div>
        )
    }
}