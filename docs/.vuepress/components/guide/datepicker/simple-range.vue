<template>
	<div class="example">
		<v-date-picker v-model="range" is-range />
	</div>
</template>

<script>
export default {
	data() {
		return {
			range: {
				start: new Date(2020, 0, 6),
				end: new Date(2020, 0, 10),
			},
		};
	},
};
</script>
