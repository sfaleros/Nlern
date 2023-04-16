import React, {useState} from 'react';
import {Button, ButtonGroup, Container, Table} from 'reactstrap';
import AppNavbar from './AppNavbar';
import {Link} from 'react-router-dom';
import {useQuery} from "react-query";

const EmptyTest = [{
    name: '',
    group: null,
    author: null,
    duration: '',
    id: null
}];

export default function TestList() {
    const [tests, setTests] = useState(EmptyTest);

    const {error, isLoading} = useQuery('tests', () =>
            fetch('/home').then(res =>
                res.json()),
        {onSuccess: setTests}
    );

    if (error) return <div>Request Failed</div>;
    if (isLoading) return <div>Loading...</div>;


    async function remove(id) {
        await fetch(`/tests/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            }
        }).then(() => {
            let updatedTests = tests.filter(i => i.id !== id);
            setTests(updatedTests);
        });
    }

    return (
        <div>
            <AppNavbar/>
            <Container fluid>
                <h3>tests</h3>
                <Table className="mt-4">
                    <thead>
                    <tr>
                        <th width="30%">Name</th>
                        <th width="40%">Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        tests.map(test =>
                            <tr key={test.id}>
                                <td style={{whiteSpace: 'nowrap'}}>{test.name}</td>
                                <td>
                                    <ButtonGroup>
                                        <Button size="sm" color="primary" tag={Link}
                                                to={"/tests/" + test.id}>Edit</Button>
                                        <Button size="sm" color="danger" onClick={() => remove(test.id)}>Delete</Button>
                                    </ButtonGroup>
                                </td>
                            </tr>
                        )
                    }
                    </tbody>
                </Table>
                <div className="float-right">
                    <Button color="success" tag={Link} to="/tests/new">Add test</Button>
                </div>
            </Container>
        </div>
    );
}

