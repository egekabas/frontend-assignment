<script setup lang="ts">
import router from "@/router";
import { useToastStore } from "@/stores/toast";
import { useUserStore } from "@/stores/user";
import { fetchy } from "@/utils/fetchy";
import { formatDate } from "@/utils/formatDate";
import { storeToRefs } from "pinia";
import { onBeforeMount, ref } from "vue";
import ValidationButton from "@/components/Validation/ValidationButton.vue";
import  CreateBioForm from "@/components/Bio/CreateBioForm.vue";


const { currentUsername, validation } = storeToRefs(useUserStore());
const { logoutUser, deleteUser, updateSession } = useUserStore();


const activeRequest = ref<false | any>(false);
const bio = ref<false | any>(false);
const loading = ref(true);

async function logout() {
  await logoutUser();
  void router.push({ name: "Home" });
}

async function delete_user() {
  if(!window.confirm("Are you sure?")){
    return;
  }

  await deleteUser();
  void router.push({ name: "Home" });
}

async function loadRequest() {
  loading.value = true;
  try{
    const res = await fetchy("/api/validation/ownRequest", "GET", {
      alert: false,
    });
    activeRequest.value = res;
  } catch (e: any){
    activeRequest.value = false;
    if(e.toString() != `Error: Validation request for ${currentUsername.value} does not exist!`){
      useToastStore().showToast({message: e.toString(), style: "error"});
    } 
  }
  loading.value = false;
}

async function loadBio(){
  loading.value = true;
  try{
    const res = await fetchy("/api/bios", "GET", {
      query: {user: currentUsername.value},
      alert: false,
    });
    bio.value = res;
  } catch (e: any){
    bio.value = false;
    if(e.toString() != `Error: Bio for user ${currentUsername.value} not found`){
      useToastStore().showToast({message: e.toString(), style: "error"});
    } 
  }
  loading.value = false;
}

async function deleteBio(){
  if(!window.confirm(`Warning: Deleting your bio will also delete any reporter validation you might have or validation requests you might have made`)){
    return;
  }

  await fetchy("/api/bios", "DELETE");
  loading.value = true;
  await Promise.all([loadRequest(), loadBio(), updateSession()]);


  loading.value = false;
}

onBeforeMount(async () =>{
  if(!validation.value){
    await loadRequest();
  }
  await loadBio();

  loading.value = false;
})

</script>

<template>
  <main v-if="!loading">
    <h1>Manage Profile for {{ currentUsername }}</h1>

    <div class = "upper-bio">
      <div v-if="bio" class="bio-container">
        <h2>Your Bio</h2>
        <p class = "bio">{{ bio.content }}</p>
        <button class = "delete" @click="deleteBio"> Delete Bio</button>
      </div>
      <div v-else>
        <h2>You have no bio!</h2>
        <p>Why not create one? You need one to get reporter validation!</p>
        <CreateBioForm @refresh-bio="loadBio"/>
      </div>
    </div>    


    <div v-if="!validation" class = "validation">
      <div v-if= "!bio">
        <h4>You need a bio to request reporter validation.</h4>
      </div>
      <div v-else-if="activeRequest">
        <h4>You last made a validation request on {{ formatDate(activeRequest.date) }}</h4>
      </div>
      <div v-else>
        <h3>Click this button to request reporter validation!</h3>
        <ValidationButton @request-validation="loadRequest" class="request" />
      </div>
    </div>
    <div v-else-if="validation">
      <h3>You have been validated since {{ formatDate(validation.date) }}</h3>
    </div>

    <button class="delete" @click="delete_user" style="margin-top: 2.5em;">Delete User</button>


  </main>
  <h v-else>LOADING</h>
</template>

<style scoped>
.request{
  font-size: 1.3em;
}
.upper-bio{
  background-color: var(--turqoise);
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 2em;
}

main {
  font-size: 1.8em;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
p.bio{
  text-align: left;
  padding-left: 5%;
  padding-right: 5%;
}

.validation{
  margin: 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
}

main{
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  background-color: var(--blue);
}

button.delete{
  margin-top: 1em;
  margin-bottom: 1em;
  font-size: 1.5em;
  background-color: red;
  padding: 0.5em;
}
button.delete:hover{
  background-color: rgb(176, 39, 39);
}

</style>