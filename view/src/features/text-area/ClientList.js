import React from 'react'
import propTypes from 'prop-types';
import styles from './ClientList.module.css';

function ClientItem({clientName, self}) {
    return (
        <div className={styles.clientListItem}>
            <span className={styles.status}></span>
            <span>{clientName}</span>
            {self ? <span>(You)</span> : null}
        </div>
    ); 
}
ClientItem.propTypes = {
    clientName: propTypes.string,
    self: propTypes.bool
};

function ClientList({clients}) {
    const clientIds = Object.keys(clients);
    return (
        <div className={styles.clientList}>
            <div className={styles.title}>{clientIds.length} Attendees</div>
            <div>
                {clientIds.map(clientId => <ClientItem key={clientId} clientName={clients[clientId].clientName} self={clients[clientId].self} />)}
            </div>
        </div>
    )
}

ClientList.propTypes = {
    clients: propTypes.object
}

export default ClientList;
