<template>
    <div class="input-group">
        <input type="text" class="form-control" placeholder="Search..." aria-label="Search..."
               @input="$emit('input', $event)" aria-describedby="filter-addon">
        <div class="input-group-append">
            <span class="input-group-text btn-outline-primary" id="filter-addon">
                <i class="fa fa-search"></i>
            </span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "search-input"
    }
</script>
