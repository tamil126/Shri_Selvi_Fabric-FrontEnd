import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
// import './AdminPasswordPrompt.css';

const AdminPasswordPrompt = ({ onConfirm, onCancel, errorMessage, username }) => {
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onConfirm(username, password);
    };

    return (
        <Modal show onHide={onCancel}>
            <Modal.Header closeButton>
                <Modal.Title className="text-center">Admin Password Required</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group>
                        {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" value={username} readOnly autoComplete="off"/>
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </Form.Group>
                    <div className="form-group">
                        <Button type="submit" variant="primary" className='mt-2'>Confirm</Button>
                        <Button type="button" variant="secondary" className='mt-1' onClick={onCancel}>Cancel</Button>
                    </div>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default AdminPasswordPrompt;
