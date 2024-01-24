import React, { Fragment, useState } from "react";
import { getToken } from "../config/Constants";
import { Button, Modal, Pagination } from "react-bootstrap";
import { showDynamicSweetAlert } from "../toast/Swal";
import axios from "axios";
import { useTable } from "react-table";
import EditSchedulerModal from "../modal/scheduler/EditSchedulerModal";
import { faPowerOff, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const SchedulerTable = ({updatePermission, deletePermission}) => {
    
    const token = getToken();
    const headers = { Authorization: `Bearer ${token}`};
    
    const [isLoadingTable, setIsLoadingTable] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const [schedulerToUpdate, setSchedulerToUpdate] = useState(null);
    const [schedulerToDelete, setSchedulerToDelete] = useState(null);

    // const [dataTable, setDataTable] = useState([]);
    const [totalItem, setTotalItem] = useState(0);
    const [currentPage, setCurrentPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);

    const dataTable = ([{ "id": 1, "name": "Test", "description": "Test", "scheduled": "0 * * * * 9", "status": "ACTIVE"}])

    const columns = React.useMemo(() => [
        { Header: 'Name', accessor: 'name'},
        { Header: 'Description', accessor: 'description'},
        { Header: 'Schedule', accessor: 'scheduled'},
        { Header: 'Status', accessor: 'status'},
        {
            Header: 'Action',
            Cell: ({row}) => (
                    <div>
                        {updatePermission && (
                            <Button variant="outline-primary" style={{ marginRight: '5px' }} onClick={() => handleUpdateScheduler(row)}>
                                <i className="fas fa-edit"/>
                            </Button>
                        )}
                        {deletePermission && (
                            <Button variant="outline-danger" style={{ marginRight: '5px' }} onClick={() => handleShowDeleteModal(row)}>
                                <i className="fas fa-power-off"/>
                            </Button>
                        )}
                    </div>
                )
        },
    ], [])

    const fetchData = async () => {
        try {
            setIsLoadingTable(true);
            
            //const response = await axios.get(`?page=${currentPage}&size=${pageSize}`, {headers});

            setTimeout(() => {
                //setDataTable(response.data);
                //setTotalItem(response.data.totalItem);
                setIsLoadingTable(false);
            }, 500)
        } catch (error) {
            console.error('Error fetching data: ', error);
            showDynamicSweetAlert('Error', error, 'error');
            setIsLoadingTable(false);
        }
    }

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable(
        {
            columns,
            data: dataTable
        }
    )
    
    const reloadData = () => {
        fetchData();
    };

    const handleUpdateScheduler = async (data) => {
        setSchedulerToUpdate(data.original);
        setShowUpdateModal(true);
    }

    const handleShowDeleteModal = async (data) => {
        setSchedulerToDelete(data.original);
        setShowDeleteModal(true);
    }

    const handleDeleteScheduler = async () => {
        setIsLoadingTable(true);
        try {
            const dataToDelete = {
                id: schedulerToDelete.id,
                status: "INACTIVE"
            };

            //axios.put(``, dataToDelete, {headers})
            console.log(dataToDelete);

            setShowDeleteModal(false);
            setSchedulerToDelete(null);

            showDynamicSweetAlert('Success', 'Scheduler has been deleted successfully', 'success');
            setIsLoadingTable(false);
            reloadData();

        } catch (error) {
            setIsLoadingTable(false);
            showDynamicSweetAlert('Error', error, 'error')
        }
    }

    const pageCount = Math.ceil(totalItem / pageSize);
    const startIndex = (currentPage) * pageSize + 1;
    const endIndex = Math.min((currentPage + 1) * pageSize, totalItem);
        
    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < pageCount) {
            setCurrentPage(newPage);
        }
    };

    const handlePageSizeChange = (event) => {
        setPageSize(parseInt(event.target.value, 10));
        setCurrentPage(0); // Kembalikan ke halaman pertama setelah mengubah ukuran halaman
    };

    const renderPaginationItems = () => {
        const paginationItems = [];

        if (pageCount <= 5) {
            // If there are less than or equal to 5 pages, render all page numbers.
            for (let i = 0; i < pageCount; i++) {
                paginationItems.push(
                    <Pagination.Item
                        key={i}
                        active={i === currentPage}
                        onClick={() => handlePageChange(i)}
                    >
                        {i + 1}
                    </Pagination.Item>
                );
            }
        } else {
            // If there are more than 5 pages, include ellipsis.
            const startPage = Math.max(0, currentPage - 2);
            const endPage = Math.min(pageCount - 1, currentPage + 2);

            if (startPage > 0) {
                paginationItems.push(
                    <Pagination.Item key="start" onClick={() => handlePageChange(0)}>
                        1
                    </Pagination.Item>
                );

                if (startPage > 1) {
                    paginationItems.push(<Pagination.Ellipsis key="start-ellipsis" />);
                }
            }

            for (let i = startPage; i <= endPage; i++) {
                paginationItems.push(
                    <Pagination.Item
                        key={i}
                        active={i === currentPage}
                        onClick={() => handlePageChange(i)}
                    >
                        {i + 1}
                    </Pagination.Item>
                );
            }

            if (endPage < pageCount - 1) {
                if (endPage < pageCount - 2) {
                    paginationItems.push(<Pagination.Ellipsis key="end-ellipsis" />);
                }

                paginationItems.push(
                    <Pagination.Item
                        key="end"
                        onClick={() => handlePageChange(pageCount - 1)}
                    >
                        {pageCount}
                    </Pagination.Item>
                );
            }
        }

        return paginationItems;
    };
    

    return(
        <Fragment>
            <div className="row mb-3">
                <div className="col-12 d-flex justify-content-end align-items-center">
                    <div className="row-per-page-label" style={{ whiteSpace: 'nowrap' }}>
                        Rows per page:
                    </div>
                    <select style={{ margin: '5px' }}
                        id="pageSizeSelect"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                        className="form-form-select form-select-sm"
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                    </select>
                </div>
            </div>
            <div className="table-container">
                <table className='table table-bordered table-hover' {...getTableProps()}>
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                        {isLoadingTable ? (
                            <tr>
                                <td colSpan={headerGroups[0].headers.length}> {/* Replace 'numberOfColumns' with the actual number of columns */}
                                    <div className="text-center">
                                        <div className="spinner-border text-primary" role="status">
                                            <span className="sr-only">Loading...</span>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            rows.map(row => {
                                prepareRow(row);
                                return (
                                    <tr {...row.getRowProps()} className="table-row-hover">

                                        {row.cells.map(cell => (
                                            <td {...cell.getCellProps()} >{cell.render('Cell')}</td>
                                        ))}
                                    </tr>
                                );
                            })
                        )
                        }
                    </tbody>
                </table>
                <div className="d-flex justify-content-between align-items-center">
                    <div>Showing {startIndex} to {endIndex} of {totalItem} entries</div>
                    <Pagination>
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 0}
                        />
                        {renderPaginationItems()}
                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === pageCount - 1}
                        />
                    </Pagination>
                </div>
            </div>
            {schedulerToUpdate &&
                <EditSchedulerModal
                    isOpenModal={showUpdateModal}
                    onClose={() => setShowUpdateModal(false)}
                    onSubmit={reloadData}
                    dataScheduler={schedulerToUpdate}
                />
            }

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header>
                    <Modal.Title>Confirmation</Modal.Title>
                    <Button variant="link default" onClick={() => setShowDeleteModal(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to turn off scheduler: {schedulerToDelete && schedulerToDelete.name}?
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        <FontAwesomeIcon icon={faTimes} />   Cancel
                    </Button>
                    <Button variant="danger" onClick={handleDeleteScheduler}>
                        <FontAwesomeIcon icon={faPowerOff} />   Turn Off
                    </Button>
                </Modal.Footer>
            </Modal>  
        </Fragment>
    )
}

export default SchedulerTable;