<template>
  <div>
    <div class="flex -mt-4">
      <div
        v-for="sponsor in sponsors"
        class="flex flex-col items-center justify-start mt-4"
      >
        <a :href="`https://github.com/${sponsor.githubUsername}`">
          <img
            :src="
              `https://avatars.githubusercontent.com/u/${sponsor.githubUserId}?s=150`
            "
            class="h-24 w-24 rounded-lg shadow-md"
            alt=""
          />
        </a>
        <a
          class="text-indigo-600 font-semibold mt-2 mb-0"
          :href="`https://github.com/${sponsor.githubUsername}`"
        >
          {{ sponsor.twitterHandle }}
        </a>
        <p class="text-gray-600 text-sm mt-1 mb-0">
          Since
          {{ sponsor.since }}
        </p>
      </div>
    </div>
    <div class="mt-10 text-center sm:text-left">
      <a
        class="bg-indigo-500 text-white font-semibold rounded-full py-3 px-4 cursor-pointer hover:bg-indigo-600 hover:text-white hover:no-underline"
        href="https://github.com/sponsors/nathanreyes"
      >
        Support this project
      </a>
    </div>
    <div class="flex flex-col-reverse sm:flex-row items-center mt-8">
      <p>
        Hi! &#128075; I'm <a href="https://nathanreyes.com">Nathan</a>, the
        creator and maintainer of V-Calendar. I started this project because I
        wanted a simple, yet flexible, way to use attributed calendars and date
        pickers in my web applications and I thought it could help others save
        some time too!
      </p>
      <div class="flex-shrink-0 sm:ml-6">
        <img
          class="custom block h-24 w-24 rounded-lg overflow-hidden object-cover shadow-md"
          src="profile.jpg"
        />
      </div>
    </div>

    <p>
      By sponsoring this project you can help ensure that this project continues
      to get the love it deserves, along with getting a shout-out in the list
      above.
    </p>
  </div>
</template>

<script>
import list from './list.json';
export default {
  data() {
    return {
      sponsors: list,
    };
  },
};
</script>
