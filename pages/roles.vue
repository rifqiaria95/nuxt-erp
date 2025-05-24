<template>
   <!-- Content wrapper -->
   <div class="content-wrapper">
        <!-- Content -->

        <div class="container-xxl flex-grow-1 container-p-y">
            <h4 class="mb-1">Roles List</h4>
            <p class="mb-6">
            A role provided access to predefined menus and features so that depending on assigned role an
            administrator can have access to what user needs.
            </p>
            <!-- Role cards -->
            <div class="row g-6">
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                        <p class="mb-0">Total 4 users</p>
                        <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Vinnie Mostowy"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/5.png" alt="Avatar" />
                            </li>
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Allen Rieske"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/12.png" alt="Avatar" />
                            </li>
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Julee Rossignol"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/6.png" alt="Avatar" />
                            </li>
                            <li class="avatar">
                            <span
                                class="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                data-bs-toggle="tooltip"
                                data-bs-placement="bottom"
                                title="3 more"
                                >+3</span
                            >
                            </li>
                        </ul>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                        <div class="role-heading">
                            <h5 class="mb-1">Administrator</h5>
                            <a
                            href="javascript:;"
                            data-bs-toggle="modal"
                            data-bs-target="#addRoleModal"
                            class="role-edit-modal">
                            <p class="mb-0">Edit Role</p>
                            </a>
                        </div>
                        <a href="javascript:void(0);" class="text-secondary"
                            ><i class="ri-file-copy-line ri-22px"></i
                        ></a>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                        <p class="mb-0">Total 7 users</p>
                        <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Jimmy Ressula"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/4.png" alt="Avatar" />
                            </li>
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="John Doe"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/1.png" alt="Avatar" />
                            </li>
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Kristi Lawker"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/2.png" alt="Avatar" />
                            </li>
                            <li class="avatar">
                            <span
                                class="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                data-bs-toggle="tooltip"
                                data-bs-placement="bottom"
                                title="3 more"
                                >+3</span
                            >
                            </li>
                        </ul>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                        <div class="role-heading">
                            <h5 class="mb-1">Editor</h5>
                            <a
                            href="javascript:;"
                            data-bs-toggle="modal"
                            data-bs-target="#addRoleModal"
                            class="role-edit-modal">
                            <p class="mb-0">Edit Role</p>
                            </a>
                        </div>
                        <a href="javascript:void(0);" class="text-secondary"
                            ><i class="ri-file-copy-line ri-22px"></i
                        ></a>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                        <p class="mb-0">Total 5 users</p>
                        <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Andrew Tye"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/6.png" alt="Avatar" />
                            </li>
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Rishi Swaat"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/9.png" alt="Avatar" />
                            </li>
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Rossie Kim"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/12.png" alt="Avatar" />
                            </li>
                            <li class="avatar">
                            <span
                                class="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                data-bs-toggle="tooltip"
                                data-bs-placement="bottom"
                                title="3 more"
                                >+3</span
                            >
                            </li>
                        </ul>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                        <div class="role-heading">
                            <h5 class="mb-1">Users</h5>
                            <a
                            href="javascript:;"
                            data-bs-toggle="modal"
                            data-bs-target="#addRoleModal"
                            class="role-edit-modal">
                            <p class="mb-0">Edit Role</p>
                            </a>
                        </div>
                        <a href="javascript:void(0);" class="text-secondary"
                            ><i class="ri-file-copy-line ri-22px"></i
                        ></a>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                        <p class="mb-0">Total 3 users</p>
                        <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Kim Karlos"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/3.png" alt="Avatar" />
                            </li>
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Katy Turner"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/9.png" alt="Avatar" />
                            </li>
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Peter Adward"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/15.png" alt="Avatar" />
                            </li>
                            <li class="avatar">
                            <span
                                class="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                data-bs-toggle="tooltip"
                                data-bs-placement="bottom"
                                title="3 more"
                                >+3</span
                            >
                            </li>
                        </ul>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                        <div class="role-heading">
                            <h5 class="mb-1">Support</h5>
                            <a
                            href="javascript:;"
                            data-bs-toggle="modal"
                            data-bs-target="#addRoleModal"
                            class="role-edit-modal">
                            <p class="mb-0">Edit Role</p>
                            </a>
                        </div>
                        <a href="javascript:void(0);" class="text-secondary"
                            ><i class="ri-file-copy-line ri-22px"></i
                        ></a>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                        <p class="mb-0">Total 2 users</p>
                        <ul class="list-unstyled d-flex align-items-center avatar-group mb-0">
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Kim Merchent"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/10.png" alt="Avatar" />
                            </li>
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Sam D'souza"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/13.png" alt="Avatar" />
                            </li>
                            <li
                            data-bs-toggle="tooltip"
                            data-popup="tooltip-custom"
                            data-bs-placement="top"
                            title="Nurvi Karlos"
                            class="avatar pull-up">
                            <img class="rounded-circle" src="/img/avatars/15.png" alt="Avatar" />
                            </li>
                            <li class="avatar">
                            <span
                                class="avatar-initial rounded-circle pull-up bg-lighter text-body"
                                data-bs-toggle="tooltip"
                                data-bs-placement="bottom"
                                title="3 more"
                                >+3</span
                            >
                            </li>
                        </ul>
                        </div>
                        <div class="d-flex justify-content-between align-items-center">
                        <div class="role-heading">
                            <h5 class="mb-1">Restricted User</h5>
                            <a
                            href="javascript:;"
                            data-bs-toggle="modal"
                            data-bs-target="#addRoleModal"
                            class="role-edit-modal">
                            <p class="mb-0">Edit Role</p>
                            </a>
                        </div>
                        <a href="javascript:void(0);" class="text-secondary"
                            ><i class="ri-file-copy-line ri-22px"></i
                        ></a>
                        </div>
                    </div>
                    </div>
                </div>
                <div class="col-xl-4 col-lg-6 col-md-6">
                    <div class="card h-100">
                    <div class="row h-100">
                        <div class="col-5">
                        <div class="d-flex align-items-end h-100 justify-content-center">
                            <img
                            src="/img/illustrations/add-new-role-illustration.png"
                            class="img-fluid"
                            alt="Image"
                            width="68" />
                        </div>
                        </div>
                        <div class="col-7">
                        <div class="card-body text-sm-end text-center ps-sm-0">
                            <button
                            data-bs-target="#addRoleModal"
                            data-bs-toggle="modal"
                            class="btn btn-sm btn-primary mb-4 text-nowrap add-new-role">
                            Add Role
                            </button>
                            <p class="mb-0">
                            Add new role,<br />
                            if it doesn't exist
                            </p>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>

                <div class="col-12">
                    <h4 class="mt-6 mb-1">Total users with their roles</h4>
                    <p class="mb-0">Find all of your company’s administrator accounts and their associate roles.</p>
                </div>
                <div class="col-12">
                    <!-- Role Table -->
                    <div class="card">
                        <div class="card-datatable table-responsive">
                            <table class="datatables-users table">
                            <thead>
                                <tr>
                                <th></th>
                                <th></th>
                                <th>User</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Plan</th>
                                <th>Status</th>
                                <th>Actions</th>
                                </tr>
                            </thead>
                            </table>
                        </div>
                    </div>
                    <!--/ Role Table -->
                </div>
            </div>
            <!--/ Role cards -->

            <!-- Add Role Modal -->
            <!-- Add Role Modal -->
            <div class="modal fade" id="addRoleModal" tabindex="-1" aria-hidden="true">
            <div class="modal-dialog modal-lg modal-simple modal-dialog-centered modal-add-new-role">
                <div class="modal-content">
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                <div class="modal-body p-0">
                    <div class="text-center mb-6">
                    <h4 class="role-title mb-2 pb-0">Add New Role</h4>
                    <p>Set role permissions</p>
                    </div>
                    <!-- Add role form -->
                    <form id="addRoleForm" class="row g-3" onsubmit="return false">
                    <div class="col-12 mb-3">
                        <div class="form-floating form-floating-outline">
                        <input
                            type="text"
                            id="modalRoleName"
                            name="modalRoleName"
                            class="form-control"
                            placeholder="Enter a role name"
                            tabindex="-1" />
                        <label for="modalRoleName">Role Name</label>
                        </div>
                    </div>
                    <div class="col-12">
                        <h5 class="mb-6">Role Permissions</h5>
                        <!-- Permission table -->
                        <div class="table-responsive">
                        <table class="table table-flush-spacing">
                            <tbody>
                            <tr>
                                <td class="text-nowrap fw-medium">
                                Administrator Access
                                <i
                                    class="ri-information-line"
                                    data-bs-toggle="tooltip"
                                    data-bs-placement="top"
                                    title="Allows a full access to the system"></i>
                                </td>
                                <td>
                                <div class="d-flex justify-content-end">
                                    <div class="form-check mb-0 mt-1">
                                    <input class="form-check-input" type="checkbox" id="selectAll" />
                                    <label class="form-check-label" for="selectAll"> Select All </label>
                                    </div>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-nowrap fw-medium">User Management</td>
                                <td>
                                <div class="d-flex justify-content-end">
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="userManagementRead" />
                                    <label class="form-check-label" for="userManagementRead"> Read </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="userManagementWrite" />
                                    <label class="form-check-label" for="userManagementWrite"> Write </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1">
                                    <input class="form-check-input" type="checkbox" id="userManagementCreate" />
                                    <label class="form-check-label" for="userManagementCreate"> Create </label>
                                    </div>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-nowrap fw-medium">Content Management</td>
                                <td>
                                <div class="d-flex justify-content-end">
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="contentManagementRead" />
                                    <label class="form-check-label" for="contentManagementRead"> Read </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="contentManagementWrite" />
                                    <label class="form-check-label" for="contentManagementWrite"> Write </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1">
                                    <input class="form-check-input" type="checkbox" id="contentManagementCreate" />
                                    <label class="form-check-label" for="contentManagementCreate"> Create </label>
                                    </div>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-nowrap fw-medium">Disputes Management</td>
                                <td>
                                <div class="d-flex justify-content-end">
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="dispManagementRead" />
                                    <label class="form-check-label" for="dispManagementRead"> Read </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="dispManagementWrite" />
                                    <label class="form-check-label" for="dispManagementWrite"> Write </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1">
                                    <input class="form-check-input" type="checkbox" id="dispManagementCreate" />
                                    <label class="form-check-label" for="dispManagementCreate"> Create </label>
                                    </div>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-nowrap fw-medium">Database Management</td>
                                <td>
                                <div class="d-flex justify-content-end">
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="dbManagementRead" />
                                    <label class="form-check-label" for="dbManagementRead"> Read </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="dbManagementWrite" />
                                    <label class="form-check-label" for="dbManagementWrite"> Write </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1">
                                    <input class="form-check-input" type="checkbox" id="dbManagementCreate" />
                                    <label class="form-check-label" for="dbManagementCreate"> Create </label>
                                    </div>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-nowrap fw-medium">Financial Management</td>
                                <td>
                                <div class="d-flex justify-content-end">
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="finManagementRead" />
                                    <label class="form-check-label" for="finManagementRead"> Read </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="finManagementWrite" />
                                    <label class="form-check-label" for="finManagementWrite"> Write </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1">
                                    <input class="form-check-input" type="checkbox" id="finManagementCreate" />
                                    <label class="form-check-label" for="finManagementCreate"> Create </label>
                                    </div>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-nowrap fw-medium">Reporting</td>
                                <td>
                                <div class="d-flex justify-content-end">
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="reportingRead" />
                                    <label class="form-check-label" for="reportingRead"> Read </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="reportingWrite" />
                                    <label class="form-check-label" for="reportingWrite"> Write </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1">
                                    <input class="form-check-input" type="checkbox" id="reportingCreate" />
                                    <label class="form-check-label" for="reportingCreate"> Create </label>
                                    </div>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-nowrap fw-medium">API Control</td>
                                <td>
                                <div class="d-flex justify-content-end">
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="apiRead" />
                                    <label class="form-check-label" for="apiRead"> Read </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="apiWrite" />
                                    <label class="form-check-label" for="apiWrite"> Write </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1">
                                    <input class="form-check-input" type="checkbox" id="apiCreate" />
                                    <label class="form-check-label" for="apiCreate"> Create </label>
                                    </div>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-nowrap fw-medium">Repository Management</td>
                                <td>
                                <div class="d-flex justify-content-end">
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="repoRead" />
                                    <label class="form-check-label" for="repoRead"> Read </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="repoWrite" />
                                    <label class="form-check-label" for="repoWrite"> Write </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1">
                                    <input class="form-check-input" type="checkbox" id="repoCreate" />
                                    <label class="form-check-label" for="repoCreate"> Create </label>
                                    </div>
                                </div>
                                </td>
                            </tr>
                            <tr>
                                <td class="text-nowrap fw-medium">Payroll</td>
                                <td>
                                <div class="d-flex justify-content-end">
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="payrollRead" />
                                    <label class="form-check-label" for="payrollRead"> Read </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1 me-4 me-lg-12">
                                    <input class="form-check-input" type="checkbox" id="payrollWrite" />
                                    <label class="form-check-label" for="payrollWrite"> Write </label>
                                    </div>
                                    <div class="form-check mb-0 mt-1">
                                    <input class="form-check-input" type="checkbox" id="payrollCreate" />
                                    <label class="form-check-label" for="payrollCreate"> Create </label>
                                    </div>
                                </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                        </div>
                        <!-- Permission table -->
                    </div>
                    <div class="col-12 d-flex flex-wrap justify-content-center gap-4 row-gap-4">
                        <button type="submit" class="btn btn-primary">Submit</button>
                        <button
                        type="reset"
                        class="btn btn-outline-secondary"
                        data-bs-dismiss="modal"
                        aria-label="Close">
                        Cancel
                        </button>
                    </div>
                    </form>
                    <!--/ Add role form -->
                </div>
                </div>
            </div>
            </div>
            <!--/ Add Role Modal -->

            <!-- / Add Role Modal -->
        </div>
        <!-- / Content -->

        <div class="content-backdrop fade"></div>
    </div>
    <!-- Content wrapper -->
</template>

<script setup>
    definePageMeta({
        layout: 'default',
        middleware: 'auth',
    });
</script>

<style>

</style>