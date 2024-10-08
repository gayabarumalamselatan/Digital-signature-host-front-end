import React, { Fragment, useState, useEffect } from 'react';
import axios from 'axios';
import GroupManagementTable from '../tables/GroupManagementTable';
import RoleMapping from '../tables/RoleMapping';
import { Modal, Button } from 'react-bootstrap';
import { USER_SERVICE_BRANCH_LIST, USER_SERVICE_GROUP_ADD, USER_SERVICE_GROUP_LIST, USER_SERVICE_GROUP_ROLE_LIST, USER_SERVICE_ROLE_LIST } from '../config/ConfigApi';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave, faTimes } from '@fortawesome/free-solid-svg-icons';
import { useRecoilValue } from 'recoil';
import { permissionsState } from '../store/Permission';
import { showDynamicSweetAlert } from '../toast/Swal';
import ReactSelect from 'react-select';

const { userLoggin, getToken, getBranch } = require('../config/Constants');

const GroupManagement = () => {
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [mappingVisible, setMappingVisible] = useState(false);
    const [groupsData, setGroupsData] = useState([]);
    const [groupsRoleData, setGroupsRoleData] = useState([]);
    const [rolesData, setRolesData] = useState([]);
    const [showNewGroupModal, setShowNewGroupModal] = useState(false);
    const [newGroupName, setNewGroupName] = useState("");
    const [mappedRoles, setMappedRoles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const permissions = useRecoilValue(permissionsState);
    const token = getToken();
    const branchId = getBranch();
    const [branchOptions, setBranchOptions] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState(null);

    console.log('permissions ', permissions);

    const canCreateGroup = permissions["Administration"]["Group Management"]["create"];

    const canUpdateGroup = permissions["Administration"]["Group Management"]["update"];
    const canDeleteGroup = permissions["Administration"]["Group Management"]["delete"];

    const headers = { Authorization: `Bearer ${token}` };
    console.log("Read Token: ", headers);

    const loadGroupsData = () => {
        setIsLoadingTable(true);
        axios.get(`${USER_SERVICE_GROUP_LIST}?branch=${branchId}`, { headers })
            .then(response => {
                setTimeout(() => {
                    setGroupsData(response.data);
                    setIsLoadingTable(false); // Stop loading
                }, 1000);

            })
            .catch(error => {
                console.error('Error fetching group data:', error);
                showDynamicSweetAlert('Error!', error, 'error');
            });
    };

    const loadGroupsRoleData = () => {
        axios.get(`${USER_SERVICE_GROUP_ROLE_LIST}?branch=${branchId}`, { headers })
            .then(response => {
                const groupsWithRoles = response.data.map(group => ({
                    ...group,
                    mappedRoles: group.roles.map(role => role.id), // Extract role IDs
                }));
                setGroupsRoleData(groupsWithRoles);
            })
            .catch(error => {
                console.error('Error fetching group data:', error);
                showDynamicSweetAlert('Error!', error, 'error');
            });
    };


    const loadRolesData = () => {
        axios.get(`${USER_SERVICE_ROLE_LIST}?branch=${branchId}`, { headers })
            .then(response => {
                setRolesData(response.data);
                // console.log(response.data); // Log roles data here
            })
            .catch(error => {
                console.error('Error fetching role data:', error);
                showDynamicSweetAlert('Error!', error, 'error');
            });
    };

    //Load group and role data when the component mounts
    useEffect(() => {
        loadGroupsData();
        // loadRolesData();
        // loadGroupsRoleData();
    }, []);

    const fetchBranchData = async () => {
        try {
            const response = await axios.get(USER_SERVICE_BRANCH_LIST, { headers });
            const branches = response.data.map(branch => ({
                value: branch.id,
                label: branch.branchName
            }));
            setBranchOptions(branches);
        } catch (error) {
            console.error('Error fetching branch data:', error);
            // Handle error
        }
    };
    useEffect(() => {
        fetchBranchData();
    }, []);

    const handleGroupSelect = (group) => {
        setSelectedGroup(group);
        setMappingVisible(false); // Hide mapping when a new group is selected
    };

    // Function to handle loading mapping for a group
    const handleLoadMapping = (group) => {
        setSelectedGroup(group);
        if (!selectedGroup) {
            showDynamicSweetAlert('Warning!', 'Please select a group first!', 'warning');
        } else {
            setIsLoading(true);
            setTimeout(() => {
                loadRolesData();
                loadGroupsRoleData();
                setIsLoading(false); // Stop loading
                setMappingVisible(true); // Show mapping when "Load Mapping" is clicked
            }, 1000);

        }
    };

    const handleCreateGroup = async () => {
        try {
            setIsLoading(true);
            const postData = {
                groupName: newGroupName,
                branchId: selectedBranch ? selectedBranch.value : null
            };

            const response = await axios.post(`${USER_SERVICE_GROUP_ADD}`, postData, { headers });
            // console.log(response.data);
            setTimeout(() => {
                setShowNewGroupModal(false);
                setNewGroupName("");
                setIsLoading(false); // Stop loading
                loadGroupsData();
                showDynamicSweetAlert('Success!', 'Group created successfully.', 'success');
            }, 1000);
        } catch (error) {
            console.error('Error creating group:', error);
            setNewGroupName("");
            showDynamicSweetAlert('Error!', error, 'error');

        }
    };

    return (
        <Fragment>

            <section className="content-header">
                <div className="container-fluid">

                    <div className="row mb-2">
                        <div className="col-sm-6">
                            <h1>Group Management</h1>
                        </div>
                        <div className="col-sm-6">
                            <ol className="breadcrumb float-sm-right">
                                <li className="breadcrumb-item"><a href="/user">Home</a></li>
                                <li className="breadcrumb-item active">Goups Management</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </section>
            <section className="content">
                <div className="card">
                    <div class="row">
                        <div class="col-12">
                            <div className="card-header">
                                <h2 className="card-title">Group Management</h2>
                                {canCreateGroup && (
                                    <a className="btn btn-success btn-sm float-right" onClick={() => setShowNewGroupModal(true)}>
                                        <i className="fas fa-users"></i> New
                                    </a>
                                )}
                            </div>
                            <div className="card-body">
                                {/* Render the group management table */}
                                <GroupManagementTable
                                    groups={groupsData}
                                    selectedGroup={selectedGroup}
                                    handleGroupSelect={handleGroupSelect}
                                    handleLoadMapping={handleLoadMapping}
                                    isLoadingTable={isLoadingTable}
                                    refetchCallback={() => loadGroupsData()}
                                    editPermission={canUpdateGroup}
                                    deletePermission={canDeleteGroup}
                                    branchOptions={branchOptions}
                                />
                                {/* Render the role mapping if a group is selected and mapping is visible */}
                                {selectedGroup && mappingVisible && (
                                    <RoleMapping
                                        selectedGroup={selectedGroup}
                                        allRoles={rolesData}
                                        setMappedRoles={setMappedRoles}
                                        groupRoleData={groupsRoleData}
                                        editPermission={canUpdateGroup}
                                        
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {isLoading && (
                <div className="full-screen-overlay">
                    <i className="fa-solid fa-spinner fa-spin full-screen-spinner"></i>
                </div>
            )}
            <Modal show={showNewGroupModal} onHide={() => setShowNewGroupModal(false)}>
                <Modal.Header>
                    <Modal.Title>Add New Group</Modal.Title>
                    {/* Ganti ikon tombol close (X) */}
                    <Button variant="link default" onClick={() => setShowNewGroupModal(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <form>
                        <div className="form-group">
                            <label htmlFor="groupName">Group Name:</label>
                            <input
                                type="text"
                                className="form-control"
                                id="groupName"
                                placeholder="Enter group name"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="selectBranch">Select Branch:</label>
                            <ReactSelect
                                id="selectBranch"
                                options={branchOptions}
                                value={selectedBranch}
                                onChange={setSelectedBranch}
                            />
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-secondary" onClick={() => setShowNewGroupModal(false)}>
                        <FontAwesomeIcon icon={faTimes} />    Cancel
                    </button>
                    <button className="btn btn-primary" onClick={() => handleCreateGroup()}>
                        <FontAwesomeIcon icon={faSave} />   Submit
                    </button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default GroupManagement;
