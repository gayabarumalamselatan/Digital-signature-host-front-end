import React, { useState } from 'react';
import { useTable } from 'react-table';
import { Modal, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes, faTrash } from '@fortawesome/free-solid-svg-icons';
import { USER_SERVICE_BRANCH_UPDATE, USER_SERVICE_BRANCH_UPDATE_STATUS, USER_SERVICE_GROUP_ROLE_UPDATE, USER_SERVICE_GROUP_ROLE_UPDATE_STATUS } from '../config/ConfigApi';
import axios from 'axios';
import { showDynamicSweetAlert } from '../toast/Swal';

const { inactive, getToken } = require('../config/Constants');


const BranchTable = ({ groups,selectedBranch,handleBranchSelect, handleLoadMapping, isLoadingTable, refetchCallback, editPermission, deletePermission }) => {
    const [editModalVisible, setEditModalVisible] = useState(false);
    const [editingGroup, setEditingGroup] = useState(null);
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const token = getToken();

    console.log('editPer ',editPermission);
    console.log('deletePer ',deletePermission);

    const columns = React.useMemo(
        () => [
            { Header: 'ID', accessor: 'id' },
            { Header: 'Branch Name', accessor: 'branchName' },
            {
                Header: 'Actions',
                Cell: ({ row }) => (
                    <div>
                        {editPermission && (
                            <Button variant="outline-primary" onClick={() => handleEditClick(row.original)}>
                                <i className="fas fa-edit"></i>
                            </Button>
                        )} &nbsp;
                        {deletePermission && (<Button variant="outline-danger" onClick={() => handleDeleteClick(row.original)}>
                            <i className="fas fa-trash"></i>
                        </Button>
                        )}
                    </div>
                ),
            },
        ],
        []
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({ columns, data: groups });

    const handleEditClick = (group) => {
        setEditingGroup(group);
        setEditModalVisible(true);
    };

    const handleEditSubmit = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };

            // Prepare the request body based on the format you provided
            const requestBody = {
                branchName: editingGroup.branchName, // Make sure to provide the correct value
                id: selectedBranch.id,
            };
            console.log(requestBody);
            setIsLoading(true);

            // Send the PUT request to update the group data
            const response = await axios.put(`${USER_SERVICE_BRANCH_UPDATE}`, requestBody, { headers });
            setTimeout(() => {
                setEditModalVisible(false);
                setIsLoading(false);
                refetchCallback();
                showDynamicSweetAlert('Success!', 'Branch name updated successfully!', 'success');
            }, 1000);
        } catch (error) {
            console.error('Error updating Branch:', error);
            showDynamicSweetAlert('Error!',error, 'error');
            setIsLoading(false);
            // Handle errors that occur during the API call
        }
    };


    const handleDeleteClick = (group) => {
        setEditingGroup(group);
        setDeleteModalVisible(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };

            // Prepare the request body based on the format you provided
            const requestBody = {
                // Make sure to provide the correct value
                id: selectedBranch.id,
                status: inactive,
            };
            console.log(requestBody);
            setIsLoading(true);

            // Send the PUT request to update the group data
            const response = await axios.put(`${USER_SERVICE_BRANCH_UPDATE_STATUS}`, requestBody, { headers });
            setTimeout(() => {
                setDeleteModalVisible(false);
                setIsLoading(false);
                refetchCallback();
                showDynamicSweetAlert('Success!', 'Branch name deleted successfully!', 'success');
            }, 1000);
        } catch (error) {
            console.error('Error updating Branch:', error);
            showDynamicSweetAlert('Error!',error, 'error'); 
            setIsLoading(false);
            // Handle errors that occur during the API call
        }
    };

    return (
        <div className="table-container">
            <table className="table table-bordered table-hover" {...getTableProps()}>
                <thead>
                    {headerGroups.map((headerGroup) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map((column) => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {isLoadingTable ? (
                        <tr>
                            <td colSpan={columns.length}>
                                <div className="text-center">
                                    <div className="spinner-border text-primary" role="status">
                                        <span className="sr-only">Loading...</span>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    ) : (
                        rows.map((row) => {
                            prepareRow(row);
                            return (
                                <tr
                                    {...row.getRowProps()}
                                    className={`${selectedBranch === row.original ? 'table-success' : ''}`}
                                    onClick={() => handleBranchSelect(row.original)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {row.cells.map((cell) => {
                                        return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                    })}
                                </tr>
                            );
                        })
                    )}
                </tbody>
            </table>

            
            {isLoading && (
                <div className="full-screen-overlay">
                    <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                </div>
            )}

            {/* Edit Group Modal */}
            <Modal show={editModalVisible} onHide={() => { setEditModalVisible(false); handleBranchSelect(null); }}>
                <Modal.Header>
                    <Modal.Title>Edit Group</Modal.Title>
                    {/* Ganti ikon tombol close (X) */}
                    <Button variant="link default" onClick={() => { setEditModalVisible(false); handleBranchSelect(null); }}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleEditSubmit}>
                        <div className="form-group">
                            <label htmlFor="branchName">Branch Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="branchName"
                                value={editingGroup ? editingGroup.branchName : ''}
                                onChange={(e) => setEditingGroup({ ...editingGroup, branchName: e.target.value })}
                            />
                        </div>

                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => { setEditModalVisible(false); handleBranchSelect(null); }}>
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                    </button>
                    <button className="btn btn-primary" onClick={() => handleEditSubmit()}>
                        <FontAwesomeIcon icon={faSave} /> Save Changes
                    </button>
                </Modal.Footer>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal show={deleteModalVisible} onHide={() => { setDeleteModalVisible(false); handleBranchSelect(null); }}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                    {/* Ganti ikon tombol close (X) */}
                    <Button variant="link default" onClick={() => { setDeleteModalVisible(false); handleBranchSelect(null); }}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete the group: {editingGroup && editingGroup.groupName}?
                </Modal.Body>


                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setDeleteModalVisible(false)}>
                        <FontAwesomeIcon icon={faTimes} /> Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        <FontAwesomeIcon icon={faTrash} />  Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default BranchTable;
