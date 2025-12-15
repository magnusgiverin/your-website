import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const imageUpload = defineType({
  name: 'imageUpload',
  title: 'Image Upload',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'string',
      description: 'Optional caption for the image',
    }),
    defineField({
      name: 'uploadedAt',
      title: 'Uploaded At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'coordinates',
      title: 'Coordinates',
      type: 'geopoint',
      description: 'Geographic coordinates associated with the image',
    }),
  ],
  preview: {
    select: {
      image: 'image',
      caption: 'caption',
    },
    prepare(selection) {
      return {
        title: selection.caption || 'Untitled Image',
        media: selection.image,
      }
    },
  },
})
