<template>
  <div class="layout-auth">
    <div class="left-panel">
      <Menu :model="items" />
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: localStorage.getItem('login'),
      // создание бококвой панели для информации о командах
      items: [
        {
          label: 'Задания',
          icon: 'pi pi-palette',
          command: () => {
            this.$router.push('/team/tasks');
          }
        },
        {
          label: 'Участники',
          icon: 'pi pi-link',
          command: () => {
            this.$router.push('/user_team');
          }
        }
      ]
    };
  }
};
</script>

<style>
.layout-auth {
  position: right fixed;
}
</style>

<style scoped>
.left-panel {
  width:60px;

}
</style>
