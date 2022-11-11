(function(){
    const deleteStoreBtns = document.querySelectorAll('.btn-delete-store');
    deleteStoreBtns.forEach(deleteStoreBtn => {
        deleteStoreBtn.addEventListener('click',(e)=>{
            if(!confirm("Are you sure to delete this store !")){
                e.preventDefault();
                window.location.assign('/store-list')
            }
        })
    })
}());
